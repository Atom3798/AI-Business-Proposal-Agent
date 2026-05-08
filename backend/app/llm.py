import json
from typing import TYPE_CHECKING, Any, Callable, Optional

import google.generativeai as genai
import httpx

from app.config import settings
from app.schemas import ALLOWED_MODELS

if TYPE_CHECKING:
    from app.schemas import ModelPanel


SYSTEM_PROMPT = """You are an expert startup advisor and business strategist.
Return practical, structured JSON for a business plan generator.
Do not invent real statistics. If market data is unavailable, say that real market research is needed.
Avoid unsupported market-size claims, fake customer counts, fake citations, and fabricated financial data."""


CORE_COMPONENTS_PROMPT = """STEP_NAME: core_components
Analyze this startup input and extract the core components.

Startup idea: {startup_idea}
Target audience: {target_audience}
Industry: {industry}
Unique differentiator: {unique_differentiator}

Return JSON with keys: problem, solution, customer, differentiation."""


VALUE_PROPOSITION_PROMPT = """STEP_NAME: value_proposition
Using these core components:
{core_components}

Return JSON with keys: tagline, description."""


CUSTOMER_PERSONAS_PROMPT = """STEP_NAME: customer_personas
Using these core components:
{core_components}

Create 2 customer personas. Return JSON with key personas, containing objects with:
name, role, demographics, pain_points, goals, solution_fit."""


COMPETITIVE_ANALYSIS_PROMPT = """STEP_NAME: competitive_analysis
Using these core components:
{core_components}

Create a competitor analysis using competitor archetypes unless real competitors are explicitly known.
Return JSON with key competitors, containing objects with:
type_or_name, strengths, weaknesses, our_advantage."""


REVENUE_MODEL_PROMPT = """STEP_NAME: revenue_model
Using these core components:
{core_components}

Return JSON with keys: primary_stream, secondary_stream, rationale.
primary_stream and secondary_stream must be objects with name and description."""


MVP_FEATURE_LIST_PROMPT = """STEP_NAME: mvp_feature_list
Using these core components:
{core_components}

Return JSON with keys: must_have and nice_to_have, both lists of strings."""


GTM_STRATEGY_PROMPT = """STEP_NAME: go_to_market_strategy
Using these core components:
{core_components}

And these personas:
{customer_personas}

Return JSON with key channels, containing 3 objects with:
channel_name, target_audience, strategy_description."""


PITCH_DECK_PROMPT = """STEP_NAME: pitch_deck_outline
Using this draft business plan:
{draft_plan}

Create a 10-slide pitch deck outline.
Return JSON with key slides, containing objects with:
slide_number, title, key_message."""


REFINEMENT_PROMPT = """STEP_NAME: refinement
Review this draft business plan:
{draft_plan}

Improve clarity, check logical consistency across sections, remove unsupported or fake statistics,
avoid hallucinated market data, label the final output as an AI-generated draft, and ensure all
required sections are present.

Return JSON with keys:
disclaimer, executive_summary, refined_sections, consistency_notes."""


PANEL_DEFAULTS = {
    "generator": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    "critic": "deepseek-ai/DeepSeek-V3",
    "refiner": "deepseek-ai/DeepSeek-R1",
}

CRITIC_PROMPT = """CRITIC ROLE: You are reviewing the following {step_name} section from an AI-generated business plan.

Original output:
{original_output}

Carefully identify:
1. Logical gaps or inconsistencies in the reasoning
2. Unsupported claims, hallucinated statistics, or fabricated data
3. Missing elements that would strengthen this section
4. Vague or overly generic content that lacks specificity

Return JSON with exactly these keys:
- issues: list of strings, each describing a specific problem found
- suggestions: list of strings, each a concrete improvement recommendation
- severity: string — overall quality level: "low" (minor polish needed), "medium" (several gaps), or "high" (major structural issues)"""


REFINER_PROMPT = """REFINER ROLE: You are improving the following {step_name} section from an AI-generated business plan.

Original output:
{original_output}

Critique from reviewer:
{critique}

Produce an improved version that:
- Addresses each issue identified in the critique
- Uses concrete, specific language (avoid generic filler)
- Does NOT invent fake statistics or fabricated data
- Maintains the exact same JSON structure and keys as the original output

Return ONLY the improved JSON — no explanation, no markdown fences."""


_HF_SYSTEM_SUFFIX = "\nIMPORTANT: Return ONLY valid JSON — no markdown fences, no explanation, no extra text."

_MODEL_PROVIDER: dict[str, str] = {
    "meta-llama/Llama-3.3-70B-Instruct-Turbo": "together",
    "deepseek-ai/DeepSeek-V3": "together",
    "deepseek-ai/DeepSeek-R1": "together",
    "moonshotai/Kimi-K2.5": "together",
    "Qwen/Qwen2.5-7B-Instruct-Turbo": "together",
    "deepseek-ai/DeepSeek-V3-0324": "hyperbolic",
}


def _hf_url(model_id: str) -> str:
    provider = _MODEL_PROVIDER.get(model_id, "together")
    return f"https://router.huggingface.co/{provider}/v1/chat/completions"


async def generate_with_llm(
    prompt: str, model: str = "meta-llama/Llama-3.3-70B-Instruct-Turbo"
) -> str:
    if model in ALLOWED_MODELS:
        return await _generate_with_hf(prompt, model)
    if _has_real_gemini_key():
        return await _generate_with_gemini(prompt)
    raise RuntimeError("No LLM backend is configured (set HF_TOKEN or GEMINI_API_KEY)")


async def _generate_with_hf(prompt: str, model_id: str) -> str:
    if not _has_real_hf_token():
        raise RuntimeError("HF_TOKEN is not configured")

    payload = {
        "model": model_id,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT + _HF_SYSTEM_SUFFIX},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 4096,
        "temperature": 0.65,
    }
    headers = {
        "Authorization": f"Bearer {settings.hf_token}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(_hf_url(model_id), json=payload, headers=headers)
        if response.status_code != 200:
            raise RuntimeError(
                f"HF API error {response.status_code}: {response.text[:300]}"
            )
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        # DeepSeek-R1 wraps output in <think>...</think> — strip reasoning before JSON
        if "<think>" in content:
            end = content.rfind("</think>")
            content = content[end + len("</think>"):].strip() if end != -1 else content
        return content


async def _generate_with_gemini(prompt: str) -> str:
    genai.configure(api_key=settings.gemini_api_key)
    gemini_model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=SYSTEM_PROMPT,
        generation_config=genai.types.GenerationConfig(
            temperature=0.65,
            response_mime_type="application/json",
        ),
    )
    response = await gemini_model.generate_content_async(prompt)
    return response.text


def _has_real_hf_token() -> bool:
    token = settings.hf_token.strip()
    return bool(token and token.lower() not in {"your_token_here", "change_me", "none", "null"})


def _has_real_gemini_key() -> bool:
    key = settings.gemini_api_key.strip()
    return bool(key and key.lower() not in {"your_key_here", "change_me", "none", "null"})


async def generate_with_panel(
    step_name: str,
    prompt: str,
    panel: "ModelPanel",
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    """Run Generator → Critic → Refiner exchange for a single plan step."""
    agents = panel.agents

    generator_model = next(
        (a.model for a in agents if a.role == "generator"),
        PANEL_DEFAULTS["generator"],
    )
    critic_agents = [a for a in agents if a.role == "critic"]
    refiner_agents = [a for a in agents if a.role == "refiner"]

    # When only 2 agents are configured, critic doubles as refiner
    if not refiner_agents:
        refiner_agents = critic_agents

    critic_model = critic_agents[0].model
    refiner_model = refiner_agents[0].model

    trace: list[dict[str, Any]] = []

    # Step 1: Generator
    try:
        raw_gen = await generate_with_llm(prompt, generator_model)
        gen_output = _parse_json(raw_gen)
    except Exception as exc:
        gen_output = {}
        raw_gen = f"Generator failed: {exc}"
    trace.append({"role": "generator", "model": generator_model, "output": raw_gen})

    # Step 2: Critic
    try:
        critic_prompt_text = CRITIC_PROMPT.format(
            step_name=step_name,
            original_output=json.dumps(gen_output, indent=2),
        )
        raw_critique = await generate_with_llm(critic_prompt_text, critic_model)
    except Exception as exc:
        raw_critique = json.dumps({"issues": [], "suggestions": [], "severity": "low", "error": str(exc)})
    trace.append({"role": "critic", "model": critic_model, "output": raw_critique})

    # Step 3: Refiner
    try:
        refiner_prompt_text = REFINER_PROMPT.format(
            step_name=step_name,
            original_output=json.dumps(gen_output, indent=2),
            critique=raw_critique,
        )
        raw_refined = await generate_with_llm(refiner_prompt_text, refiner_model)
        refined_output = _parse_json(raw_refined)
    except Exception as exc:
        refined_output = gen_output  # fall back to generator output
        raw_refined = f"Refiner failed: {exc}"
    trace.append({"role": "refiner", "model": refiner_model, "output": raw_refined})

    return refined_output, trace


async def generate_business_plan_chain(
    input_data: Any,
    model: str = "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    panel: Optional["ModelPanel"] = None,
) -> dict[str, Any]:
    payload = _input_to_dict(input_data)
    steps: list[dict[str, Any]] = []

    core_components = await _run_step(
        "core_components",
        CORE_COMPONENTS_PROMPT.format(**payload),
        lambda: _fallback_core_components(payload),
        steps,
        model,
        panel,
    )
    core_components_json = json.dumps(core_components, indent=2)

    value_proposition = await _run_step(
        "value_proposition",
        VALUE_PROPOSITION_PROMPT.format(core_components=core_components_json),
        lambda: _fallback_value_proposition(core_components),
        steps,
        model,
        panel,
    )
    customer_personas = await _run_step(
        "customer_personas",
        CUSTOMER_PERSONAS_PROMPT.format(core_components=core_components_json),
        lambda: _fallback_customer_personas(core_components),
        steps,
        model,
        panel,
    )
    competitive_analysis = await _run_step(
        "competitive_analysis",
        COMPETITIVE_ANALYSIS_PROMPT.format(core_components=core_components_json),
        lambda: _fallback_competitive_analysis(core_components),
        steps,
        model,
        panel,
    )
    revenue_model = await _run_step(
        "revenue_model",
        REVENUE_MODEL_PROMPT.format(core_components=core_components_json),
        lambda: _fallback_revenue_model(core_components),
        steps,
        model,
        panel,
    )
    mvp_feature_list = await _run_step(
        "mvp_feature_list",
        MVP_FEATURE_LIST_PROMPT.format(core_components=core_components_json),
        lambda: _fallback_mvp_features(core_components),
        steps,
        model,
        panel,
    )

    personas_json = json.dumps(customer_personas, indent=2)
    go_to_market_strategy = await _run_step(
        "go_to_market_strategy",
        GTM_STRATEGY_PROMPT.format(
            core_components=core_components_json,
            customer_personas=personas_json,
        ),
        lambda: _fallback_gtm_strategy(core_components),
        steps,
        model,
        panel,
    )

    generated_sections = {
        "core_components": core_components,
        "value_proposition": value_proposition,
        "customer_personas": customer_personas,
        "competitive_analysis": competitive_analysis,
        "revenue_model": revenue_model,
        "mvp_feature_list": mvp_feature_list,
        "go_to_market_strategy": go_to_market_strategy,
    }
    draft_plan = {
        **payload,
        "generated_sections": generated_sections,
    }

    pitch_deck_outline = await _run_step(
        "pitch_deck_outline",
        PITCH_DECK_PROMPT.format(draft_plan=json.dumps(draft_plan, indent=2)),
        lambda: _fallback_pitch_deck(generated_sections),
        steps,
        model,
        panel,
    )
    draft_plan["pitch_deck_outline"] = pitch_deck_outline

    refinement = await refine_and_validate_plan(draft_plan, steps=steps, model=model, panel=panel)

    return {
        "generated_sections": generated_sections,
        "refined_plan": refinement["refined_plan"],
        "pitch_deck_outline": pitch_deck_outline,
        "validation_result": refinement["validation_result"],
        "_steps": steps,
    }


async def refine_and_validate_plan(
    plan_data: dict[str, Any],
    steps: Optional[list[dict[str, Any]]] = None,
    model: str = "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    panel: Optional["ModelPanel"] = None,
) -> dict[str, Any]:
    local_steps = steps if steps is not None else []
    refined_plan = await _run_step(
        "refinement",
        REFINEMENT_PROMPT.format(draft_plan=json.dumps(plan_data, indent=2)),
        lambda: _fallback_refined_plan(plan_data),
        local_steps,
        model,
        panel,
    )

    validation_result = _validate_plan(plan_data, refined_plan)
    return {
        "refined_plan": refined_plan,
        "validation_result": validation_result,
    }


async def _run_step(
    step_name: str,
    prompt: str,
    fallback_factory: Callable[[], dict[str, Any]],
    steps: list[dict[str, Any]],
    model: str = "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    panel: Optional["ModelPanel"] = None,
) -> dict[str, Any]:
    step_panel_trace: Optional[list[dict[str, Any]]] = None
    try:
        if panel is not None:
            output, step_panel_trace = await generate_with_panel(step_name, prompt, panel)
        else:
            raw_output = await generate_with_llm(prompt, model)
            output = _parse_json(raw_output)
    except Exception as exc:
        output = fallback_factory()
        output.setdefault(
            "generation_note",
            f"Local fallback used because the LLM call failed: {str(exc)}",
        )

    step: dict[str, Any] = {
        "step_name": step_name,
        "prompt": prompt,
        "output": json.dumps(output, indent=2),
    }
    if step_panel_trace is not None:
        step["panel_trace"] = step_panel_trace
    steps.append(step)
    return output


def _parse_json(raw_output: str) -> dict[str, Any]:
    cleaned = raw_output.strip()

    # Strip markdown code fences (```json ... ``` or ``` ... ```)
    if cleaned.startswith("```"):
        end = cleaned.rfind("```", 3)
        inner = cleaned[3:end] if end > 3 else cleaned[3:]
        cleaned = inner.lstrip("json").strip()

    # Try direct parse first
    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    # Fall back: extract the first {...} block from the response
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end > start:
        try:
            parsed = json.loads(cleaned[start : end + 1])
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not extract JSON object from LLM response: {cleaned[:200]!r}")


def _input_to_dict(input_data: Any) -> dict[str, str]:
    if hasattr(input_data, "model_dump"):
        data = input_data.model_dump()
    elif isinstance(input_data, dict):
        data = input_data
    else:
        data = vars(input_data)
    return {
        "startup_idea": str(data.get("startup_idea", "")).strip(),
        "target_audience": str(data.get("target_audience", "")).strip(),
        "industry": str(data.get("industry", "")).strip(),
        "unique_differentiator": str(data.get("unique_differentiator", "")).strip(),
    }


def _fallback_core_components(payload: dict[str, str]) -> dict[str, str]:
    target = payload["target_audience"] or "the target customer segment"
    industry = payload["industry"] or "the selected market"
    differentiator = payload["unique_differentiator"] or "a focused user experience"
    return {
        "problem": f"{target} has an unresolved pain point in {industry} related to {payload['startup_idea']}.",
        "solution": f"Build {payload['startup_idea']} as a practical product or service that addresses the pain directly.",
        "customer": target,
        "differentiation": differentiator,
    }


def _fallback_value_proposition(core: dict[str, Any]) -> dict[str, str]:
    return {
        "tagline": f"A clearer way for {core.get('customer', 'customers')} to solve their core problem.",
        "description": (
            f"This offering helps {core.get('customer', 'customers')} move from "
            f"{core.get('problem', 'a persistent pain point')} to "
            f"{core.get('solution', 'a practical solution')} through "
            f"{core.get('differentiation', 'a focused differentiated approach')}."
        ),
    }


def _fallback_customer_personas(core: dict[str, Any]) -> dict[str, Any]:
    return {
        "personas": [
            {
                "name": "Primary Early Adopter",
                "role": "Decision maker or hands-on user",
                "demographics": core.get("customer", "Target audience"),
                "pain_points": [core.get("problem", "Needs a better solution")],
                "goals": ["Save time", "Reduce friction", "Achieve a better outcome"],
                "solution_fit": core.get("solution", "The product addresses the key pain point"),
            },
            {
                "name": "Operational Influencer",
                "role": "Team member who evaluates workflow impact",
                "demographics": "Adjacent user impacted by the problem",
                "pain_points": ["Current alternatives require manual work or fragmented tools"],
                "goals": ["Improve reliability", "Make adoption simple"],
                "solution_fit": "The solution should be easy to trial and simple to explain internally.",
            },
        ]
    }


def _fallback_competitive_analysis(core: dict[str, Any]) -> dict[str, Any]:
    return {
        "competitors": [
            {
                "type_or_name": "Manual workflow alternatives",
                "strengths": "Low cost and familiar to users",
                "weaknesses": "Time consuming, inconsistent, and difficult to scale",
                "our_advantage": core.get("differentiation", "A more focused product experience"),
            },
            {
                "type_or_name": "Broad software platforms",
                "strengths": "Feature-rich and established",
                "weaknesses": "May be too complex or generic for the target use case",
                "our_advantage": "Narrower positioning and faster path to value for early users",
            },
        ]
    }


def _fallback_revenue_model(core: dict[str, Any]) -> dict[str, Any]:
    return {
        "primary_stream": {
            "name": "Subscription",
            "description": "Charge recurring monthly or annual fees based on usage tier or team size.",
        },
        "secondary_stream": {
            "name": "Services or implementation support",
            "description": "Offer onboarding, customization, or consulting for customers who need help adopting the solution.",
        },
        "rationale": (
            "A recurring model fits products that deliver ongoing value. Pricing and market size "
            "must be validated with customer discovery and real market research."
        ),
    }


def _fallback_mvp_features(core: dict[str, Any]) -> dict[str, Any]:
    return {
        "must_have": [
            "User onboarding for the primary customer",
            "Core workflow that solves the stated problem",
            "Basic account and data management",
            "Simple reporting or progress visibility",
        ],
        "nice_to_have": [
            "Advanced analytics",
            "Third-party integrations",
            "Team collaboration features",
        ],
    }


def _fallback_gtm_strategy(core: dict[str, Any]) -> dict[str, Any]:
    customer = core.get("customer", "target customers")
    return {
        "channels": [
            {
                "channel_name": "Founder-led outreach",
                "target_audience": customer,
                "strategy_description": "Interview prospects, validate pain severity, and convert qualified design partners.",
            },
            {
                "channel_name": "Content and community",
                "target_audience": customer,
                "strategy_description": "Publish practical problem-focused content where the audience already learns and compares tools.",
            },
            {
                "channel_name": "Partnerships",
                "target_audience": "Adjacent service providers or communities",
                "strategy_description": "Partner with trusted groups that already serve the same customer profile.",
            },
        ]
    }


def _fallback_pitch_deck(generated_sections: dict[str, Any]) -> dict[str, Any]:
    titles = [
        "Title",
        "Problem",
        "Solution",
        "Customer",
        "Value Proposition",
        "Market Validation Needed",
        "Competition",
        "Business Model",
        "Go-To-Market",
        "MVP and Next Steps",
    ]
    return {
        "slides": [
            {
                "slide_number": index + 1,
                "title": title,
                "key_message": "Summarize this section using validated customer evidence before investor or public use.",
            }
            for index, title in enumerate(titles)
        ]
    }


def _fallback_refined_plan(plan_data: dict[str, Any]) -> dict[str, Any]:
    return {
        "disclaimer": "This is an AI-generated draft. Validate all claims with real customer and market research.",
        "executive_summary": (
            "The draft business plan organizes the startup concept into core strategy sections. "
            "It avoids unsupported statistics and highlights areas requiring validation."
        ),
        "refined_sections": plan_data.get("generated_sections", {}),
        "consistency_notes": [
            "Revenue assumptions require customer willingness-to-pay validation.",
            "Market sizing and competitor details should be confirmed with independent research.",
        ],
    }


def _validate_plan(
    plan_data: dict[str, Any], refined_plan: dict[str, Any]
) -> dict[str, Any]:
    required_sections = [
        "core_components",
        "value_proposition",
        "customer_personas",
        "competitive_analysis",
        "revenue_model",
        "mvp_feature_list",
        "go_to_market_strategy",
    ]
    generated_sections = plan_data.get("generated_sections", {})
    missing_sections = [
        section for section in required_sections if not generated_sections.get(section)
    ]

    fallback_sections = [
        section
        for section in required_sections
        if isinstance(generated_sections.get(section), dict)
        and "generation_note" in generated_sections[section]
    ]

    warnings = [
        "This is an AI-generated draft and should not be treated as verified market research.",
        "Do not use market size, revenue, or adoption claims until validated with real data.",
    ]
    if fallback_sections:
        warnings.append(
            f"Local fallback content was used for: {', '.join(fallback_sections)}. "
            "Check that HF_TOKEN is set and the selected model is available."
        )
    if not refined_plan.get("disclaimer"):
        warnings.append("Refined plan did not include an explicit AI-generated draft disclaimer.")

    return {
        "complete": len(missing_sections) == 0,
        "missing_sections": missing_sections,
        "warnings": warnings,
    }
