# These prompts drive our entire AI pipeline, defining how the model thinks about business strategy.

# This sets the general persona for the AI, making sure it acts like a seasoned VC rather than a generic chatbot.
SYSTEM_PROMPT = """You are an expert startup advisor, venture capitalist, and business strategist. 
Your goal is to help aspiring entrepreneurs flesh out their startup ideas into comprehensive, 
structured, and highly professional business plans. 
Ensure your tone is encouraging, objective, analytical, and professional.
Avoid hallucinating fake statistics; use general market trends if specific data is unavailable."""

# We start by taking the user's raw input and distilling it into core components like the problem and solution.
EXTRACTION_PROMPT = """Analyze the following startup idea and extract the core components:
Idea: "{startup_idea}"
Target Audience (if provided): "{target_audience}"
Industry (if provided): "{industry}"
Unique Differentiator (if provided): "{unique_differentiator}"

Provide a highly concise summary of:
1. The Core Problem being solved.
2. The Proposed Solution.
3. The Primary Customer.
4. The Key Differentiation.

Format as a structured JSON object with keys: "problem", "solution", "customer", "differentiation".
"""

# This generates a high-level value proposition that summarizes the "why" behind the business.
VALUE_PROPOSITION_PROMPT = """Based on the core concept:
{core_concept}

Write a compelling Value Proposition. This should be a concise statement that explains what benefit you provide for who and how you do it uniquely well. 
Include a 1-sentence tagline and a slightly longer descriptive paragraph.
Format as JSON with keys: "tagline", "description".
"""

# Here we create detailed archetypes of who would actually buy this, focusing on their pain points and goals.
CUSTOMER_PERSONAS_PROMPT = """Based on the core concept:
{core_concept}

Create 2 distinct Customer Personas who would heavily use this product/service. 
For each persona, include their demographics, pain points, goals, and how this product solves their specific problem.
Format as JSON with a list of objects under key "personas", each containing: "name", "role", "demographics", "pain_points", "goals", "solution_fit".
"""

# This maps out the market landscape and identifies where this startup fits in compared to others.
COMPETITIVE_ANALYSIS_PROMPT = """Based on the core concept:
{core_concept}

Conduct a Competitive Analysis. Identify 2-3 types of direct or indirect competitors (you can invent realistic archetypes if exact real-world competitors are unknown, but state them as archetypes). 
Explain how this startup differentiates from them (strengths and weaknesses of alternatives vs this solution).
Format as JSON with a list of objects under key "competitors", each containing: "type_or_name", "strengths", "weaknesses", "our_advantage".
"""

# This outlines how the business actually makes money, recommending both primary and secondary streams.
REVENUE_MODEL_PROMPT = """Based on the core concept:
{core_concept}

Define a viable Revenue Model. How will this startup make money? Recommend 1 primary revenue stream and 1 secondary potential stream (e.g., SaaS subscription, transaction fee, freemium, ads, etc.). 
Briefly explain why these models fit the product.
Format as JSON with keys: "primary_stream" (object with "name", "description"), "secondary_stream" (object with "name", "description"), "rationale".
"""

# This defines the initial feature set needed to get the product off the ground and prove it works.
MVP_FEATURES_PROMPT = """Based on the core concept:
{core_concept}

List the Minimum Viable Product (MVP) feature list. What are the absolute core features needed to prove the value proposition to early adopters? 
Categorize into "Must-Have" (core value) and "Nice-to-Have" (post-MVP).
Format as JSON with keys: "must_have" (list of strings), "nice_to_have" (list of strings).
"""

# Using the personas we generated earlier, we figure out the best channels to reach the first customers.
GTM_STRATEGY_PROMPT = """Based on the core concept:
{core_concept}
and the Customer Personas:
{personas}

Outline a Go-to-Market (GTM) strategy for launch. Identify 3 specific acquisition channels to reach the target personas initially.
Format as JSON with a list of objects under key "channels", each containing: "channel_name", "target_audience", "strategy_description".
"""

# This pulls everything together into a slide-by-slide outline that a founder could use for a presentation.
PITCH_DECK_PROMPT = """Based on the full business plan generated so far:
Value Prop: {value_prop}
Personas: {personas}
Competitors: {competitors}
Revenue: {revenue}
MVP: {mvp}
GTM: {gtm}

Create a standard 10-slide Pitch Deck Outline. Briefly state the title and key message for each slide.
Format as JSON with a list of objects under key "slides", each containing: "slide_number", "title", "key_message".
"""

# This is a final check to make sure all the generated sections actually make sense together.
REFINEMENT_PROMPT = """Review the following compiled business plan sections for logical consistency, tone, and overall flow:
{draft_plan}

Ensure that the proposed revenue model aligns with the target personas, that the MVP features support the value proposition, and that the GTM strategy is realistic for the industry.
If there are any inconsistencies, resolve them by slightly adjusting the content to create a cohesive narrative. 
Return the refined, finalized business plan in the same structured format.
"""
