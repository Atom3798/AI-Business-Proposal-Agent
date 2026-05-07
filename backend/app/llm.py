import json
from typing import Any, Callable, Optional

import google.generativeai as genai

from app.config import settings


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


async def generate_with_llm(prompt: str) -> str:
    if not _has_real_gemini_key():
        raise RuntimeError("GEMINI_API_KEY is not configured")

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=SYSTEM_PROMPT,
        generation_config=genai.types.GenerationConfig(
            temperature=0.65,
            response_mime_type="application/json",
        ),
    )
    response = await model.generate_content_async(prompt)
    return response.text


def _has_real_gemini_key() -> bool:
    key = settings.gemini_api_key.strip()
    return bool(key and key.lower() not in {"your_key_here", "change_me", "none", "null"})


async def generate_business_plan_chain(input_data: Any) -> dict[str, Any]:
    payload = _input_to_dict(input_data)
    steps: list[dict[str, str]] = []

    core_components = await _run_step(
        "core_components",
        CORE_COMPONENTS_PROMPT.format(**payload),
        lambda: _fallback_core_components(payload),
        steps,
    )
    core_components_json = json.dumps(core_components, indent=2)

    value_proposition = await _run_step(
        "value_proposition",
        VALUE_PROPOSITION_PROMPT.format(core_components=core_components_json),
        lambda: _fallback_value_proposition(core_components),
        steps,
    )
    customer_personas = await _run_step(
        "customer_personas",
        CUSTOMER_PERSONAS_PROMPT.format(core_components=core_components_json),
        lambda: _fallback_customer_personas(core_components),
        steps,
    )
    competitive_analysis = await _run_step(
        "competitive_analysis",
        COMPETITIVE_ANALYSIS_PROMPT.format(core_components=core_components_json),
        lambda: _fallback_competitive_analysis(core_components),
        steps,
    )
    revenue_model = await _run_step(
        "revenue_model",
        REVENUE_MODEL_PROMPT.format(core_components=core_components_json),
        lambda: _fallback_revenue_model(core_components),
        steps,
    )
    mvp_feature_list = await _run_step(
        "mvp_feature_list",
        MVP_FEATURE_LIST_PROMPT.format(core_components=core_components_json),
        lambda: _fallback_mvp_features(core_components),
        steps,
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
    )
    draft_plan["pitch_deck_outline"] = pitch_deck_outline

    refinement = await refine_and_validate_plan(draft_plan, steps=steps)

    return {
        "generated_sections": generated_sections,
        "refined_plan": refinement["refined_plan"],
        "pitch_deck_outline": pitch_deck_outline,
        "validation_result": refinement["validation_result"],
        "_steps": steps,
    }


async def refine_and_validate_plan(
    plan_data: dict[str, Any], steps: Optional[list[dict[str, str]]] = None
) -> dict[str, Any]:
    local_steps = steps if steps is not None else []
    refined_plan = await _run_step(
        "refinement",
        REFINEMENT_PROMPT.format(draft_plan=json.dumps(plan_data, indent=2)),
        lambda: _fallback_refined_plan(plan_data),
        local_steps,
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
    steps: list[dict[str, str]],
) -> dict[str, Any]:
    try:
        raw_output = await generate_with_llm(prompt)
        output = _parse_json(raw_output)
    except Exception as exc:
        output = fallback_factory()
        raw_output = json.dumps(output, indent=2)
        output.setdefault(
            "generation_note",
            f"Local fallback used because the LLM call failed: {str(exc)}",
        )

    steps.append(
        {
            "step_name": step_name,
            "prompt": prompt,
            "output": json.dumps(output, indent=2),
        }
    )
    return output


def _parse_json(raw_output: str) -> dict[str, Any]:
    cleaned = raw_output.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned.removeprefix("```json").removesuffix("```").strip()
    elif cleaned.startswith("```"):
        cleaned = cleaned.removeprefix("```").removesuffix("```").strip()
    parsed = json.loads(cleaned)
    if not isinstance(parsed, dict):
        raise ValueError("LLM response must be a JSON object")
    return parsed


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

    warnings = [
        "This is an AI-generated draft and should not be treated as verified market research.",
        "Do not use market size, revenue, or adoption claims until validated with real data.",
    ]
    if not refined_plan.get("disclaimer"):
        warnings.append("Refined plan did not include an explicit AI-generated draft disclaimer.")

    return {
        "complete": len(missing_sections) == 0,
        "missing_sections": missing_sections,
        "warnings": warnings,
    }
