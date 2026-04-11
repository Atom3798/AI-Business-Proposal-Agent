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

async def call_llm(prompt: str, response_format: dict = None) -> str:
    """This helper handles the actual API call to OpenAI, keeping the model and settings consistent."""
    try:
        kwargs = {
            "model": "gpt-4o", 
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
        }
        
        if response_format:
             kwargs["response_format"] = {"type": "json_object"}

        response = await client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
    except Exception as e:
        print(f"Something went wrong with the LLM call: {e}")
        raise e

async def generate_business_plan(startup_idea: str, target_audience: str = "", industry: str = "", unique_differentiator: str = "") -> dict:
    """This function orchestrates the prompt chain, building the plan piece by piece based on the user's idea."""
    
    # We start by distilling the raw user input into a clean core concept that the other prompts can build on.
    extraction_input = EXTRACTION_PROMPT.format(
        startup_idea=startup_idea,
        target_audience=target_audience,
        industry=industry,
        unique_differentiator=unique_differentiator
    )
    core_concept_json = await call_llm(extraction_input, response_format={"type": "json_object"})
    core_concept = json.loads(core_concept_json)
    core_concept_str = json.dumps(core_concept, indent=2)

    # With the core concept ready, we can now generate the individual sections of the business plan.
    # While these run one after another right now, we could later run them in parallel to speed things up.
    
    val_prop_json = await call_llm(VALUE_PROPOSITION_PROMPT.format(core_concept=core_concept_str), response_format={"type": "json_object"})
    personas_json = await call_llm(CUSTOMER_PERSONAS_PROMPT.format(core_concept=core_concept_str), response_format={"type": "json_object"})
    competitors_json = await call_llm(COMPETITIVE_ANALYSIS_PROMPT.format(core_concept=core_concept_str), response_format={"type": "json_object"})
    revenue_json = await call_llm(REVENUE_MODEL_PROMPT.format(core_concept=core_concept_str), response_format={"type": "json_object"})
    mvp_json = await call_llm(MVP_FEATURES_PROMPT.format(core_concept=core_concept_str), response_format={"type": "json_object"})
    
    # The GTM strategy relies on the personas we just created to ensure the acquisition channels make sense.
    gtm_json = await call_llm(
        GTM_STRATEGY_PROMPT.format(core_concept=core_concept_str, personas=personas_json), 
        response_format={"type": "json_object"}
    )
    
    # Finally, we use everything we've generated to build a cohesive pitch deck outline.
    pitch_deck_json = await call_llm(
        PITCH_DECK_PROMPT.format(
            value_prop=val_prop_json,
            personas=personas_json,
            competitors=competitors_json,
            revenue=revenue_json,
            mvp=mvp_json,
            gtm=gtm_json
        ), 
        response_format={"type": "json_object"}
    )

    # We pack all the generated parts into a single dictionary to return to the frontend.
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

    # We can eventually pass the entire draft through a refinement prompt to polish any inconsistencies.
    # refinement_input = REFINEMENT_PROMPT.format(draft_plan=json.dumps(draft_plan, indent=2))
    # refined_plan_json = await call_llm(refinement_input, response_format={"type": "json_object"})
    # final_plan = json.loads(refined_plan_json)

    return draft_plan
