import asyncio
import json
from openai import AsyncOpenAI
import os
from app.services.prompts import (
    SYSTEM_PROMPT,
    EXTRACTION_PROMPT,
    VALUE_PROPOSITION_PROMPT,
    CUSTOMER_PERSONAS_PROMPT,
    COMPETITIVE_ANALYSIS_PROMPT,
    REVENUE_MODEL_PROMPT,
    MVP_FEATURES_PROMPT,
    GTM_STRATEGY_PROMPT,
    PITCH_DECK_PROMPT,
    REFINEMENT_PROMPT
)

# We're using the async OpenAI client to handle requests without blocking the rest of our app.
client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

async def call_llm(prompt: str, json_mode: bool = True) -> str:
    """Handles the OpenAI API call, forces a structured JSON response"""
    try:
        kwargs = {
            "model": "gpt-4o",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        response = await client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling LLM: {e}")
        raise

async def generate_business_plan(startup_idea: str, 
                                 target_audience: str = "", 
                                 industry: str = "", 
                                 unique_differentiator: str = "",
                                 refine: bool = False) -> dict:
    """This function orchestrates the prompt chain, building the plan piece by piece based on the user's idea."""
    
    # 1. Extract core concept first, everything else depends on this step.
    extraction_input = EXTRACTION_PROMPT.format(
        startup_idea=startup_idea,
        target_audience=target_audience,
        industry=industry,
        unique_differentiator=unique_differentiator
    )
    core_concept_json = await call_llm(extraction_input)
    core_concept = json.loads(core_concept_json)
    core_concept_str = json.dumps(core_concept, indent=2)

    # 2. Run 5 independent calls in parallel since these can be generated simultaneously.
    (
        val_prop_json,
        personas_json,
        competitors_json,
        revenue_json,
        mvp_json
    ) = await asyncio.gather(
        call_llm(VALUE_PROPOSITION_PROMPT.format(core_concept=core_concept_str)),
        call_llm(CUSTOMER_PERSONAS_PROMPT.format(core_concept=core_concept_str)),
        call_llm(COMPETITIVE_ANALYSIS_PROMPT.format(core_concept=core_concept_str)),
        call_llm(REVENUE_MODEL_PROMPT.format(core_concept=core_concept_str)),
        call_llm(MVP_FEATURES_PROMPT.format(core_concept=core_concept_str))
    )

    # 3. GTM Strategy depends on the personas from step 2
    gtm_json = await call_llm(
        GTM_STRATEGY_PROMPT.format(core_concept=core_concept_str, personas=personas_json)
    )
    
    # 4. Compile everything into a single plan object to return to the user.
    pitch_deck_json = await call_llm(
        PITCH_DECK_PROMPT.format(
            value_prop=val_prop_json,
            personas=personas_json,
            competitors=competitors_json,
            revenue=revenue_json,
            mvp=mvp_json,
            gtm=gtm_json
        )
    )

    draft_plan = {
        "core_concept": core_concept,
        "value_proposition": json.loads(val_prop_json),
        "customer_personas": json.loads(personas_json),
        "competitive_analysis": json.loads(competitors_json),
        "revenue_model": json.loads(revenue_json),
        "mvp_features": json.loads(mvp_json),
        "gtm_strategy": json.loads(gtm_json),
        "pitch_deck": json.loads(pitch_deck_json)
    }

    # 5. Optional refinement pass for consistency and polish, if the user requested it.
    if refine:
        refinement_input = REFINEMENT_PROMPT.format(draft_plan=json.dumps(draft_plan, indent=2))
        refinded_plan = await call_llm(refinement_input)
        return json.loads(refinded_plan)

    return draft_plan
