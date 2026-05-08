"""
Pure unit tests for app/llm.py — no network calls, no storage.

Covers:
- _parse_json: various valid / malformed inputs
- _input_to_dict: Pydantic model, plain dict, fallback
- _has_real_hf_token / _has_real_gemini_key: sentinel rejection
- All eight fallback factories (structural completeness)
- _validate_plan: complete vs. incomplete plan, fallback warning
"""

import json

import pytest

from app.llm import (
    _fallback_competitive_analysis,
    _fallback_core_components,
    _fallback_customer_personas,
    _fallback_gtm_strategy,
    _fallback_mvp_features,
    _fallback_pitch_deck,
    _fallback_refined_plan,
    _fallback_revenue_model,
    _fallback_value_proposition,
    _has_real_gemini_key,
    _has_real_hf_token,
    _input_to_dict,
    _parse_json,
    _validate_plan,
)
from app.schemas import GenerateRequest


# ---------------------------------------------------------------------------
# _parse_json
# ---------------------------------------------------------------------------


class TestParseJson:
    def test_plain_json_object(self):
        raw = '{"key": "value"}'
        assert _parse_json(raw) == {"key": "value"}

    def test_json_with_leading_trailing_whitespace(self):
        raw = '  \n{"x": 1}  \n'
        assert _parse_json(raw) == {"x": 1}

    def test_markdown_json_fence(self):
        raw = "```json\n{\"a\": 2}\n```"
        assert _parse_json(raw) == {"a": 2}

    def test_markdown_generic_fence(self):
        raw = "```\n{\"b\": 3}\n```"
        assert _parse_json(raw) == {"b": 3}

    def test_json_buried_in_prose(self):
        raw = 'Here is the result: {"answer": 42} — enjoy!'
        assert _parse_json(raw) == {"answer": 42}

    def test_nested_json(self):
        raw = json.dumps({"outer": {"inner": [1, 2, 3]}})
        result = _parse_json(raw)
        assert result["outer"]["inner"] == [1, 2, 3]

    def test_raises_on_pure_text(self):
        with pytest.raises(ValueError, match="Could not extract JSON"):
            _parse_json("This is not JSON at all.")

    def test_raises_on_empty_string(self):
        with pytest.raises(ValueError):
            _parse_json("")

    def test_raises_on_json_array(self):
        # Top-level arrays are not dict — should raise
        with pytest.raises(ValueError):
            _parse_json("[1, 2, 3]")

    def test_deepseek_think_tag_stripped_upstream(self):
        # _parse_json only sees content after the caller strips <think>
        inner = '{"result": "clean"}'
        assert _parse_json(inner) == {"result": "clean"}


# ---------------------------------------------------------------------------
# _input_to_dict
# ---------------------------------------------------------------------------


class TestInputToDict:
    def test_from_pydantic_model(self):
        model = GenerateRequest(
            startup_idea="AI tutor",
            target_audience="Students",
            industry="EdTech",
            unique_differentiator="Adaptive pacing",
        )
        result = _input_to_dict(model)
        assert result["startup_idea"] == "AI tutor"
        assert result["industry"] == "EdTech"

    def test_from_plain_dict(self):
        data = {
            "startup_idea": "Dog-walking app",
            "target_audience": "Pet owners",
            "industry": "Pet care",
            "unique_differentiator": "GPS tracking",
        }
        result = _input_to_dict(data)
        assert result == data

    def test_missing_keys_become_empty_strings(self):
        result = _input_to_dict({"startup_idea": "Minimal"})
        assert result["target_audience"] == ""
        assert result["industry"] == ""
        assert result["unique_differentiator"] == ""

    def test_values_are_stripped(self):
        result = _input_to_dict({"startup_idea": "  Spaced  "})
        assert result["startup_idea"] == "Spaced"


# ---------------------------------------------------------------------------
# Credential sentinel checks
# ---------------------------------------------------------------------------


class TestCredentialChecks:
    @pytest.mark.parametrize("bad_token", ["", "your_token_here", "change_me", "none", "null"])
    def test_hf_token_rejects_sentinels(self, bad_token, monkeypatch):
        monkeypatch.setattr("app.llm.settings.hf_token", bad_token)
        assert _has_real_hf_token() is False

    def test_hf_token_accepts_real_value(self, monkeypatch):
        monkeypatch.setattr("app.llm.settings.hf_token", "hf_abc123realtoken")
        assert _has_real_hf_token() is True

    @pytest.mark.parametrize("bad_key", ["", "your_key_here", "change_me", "none", "null"])
    def test_gemini_key_rejects_sentinels(self, bad_key, monkeypatch):
        monkeypatch.setattr("app.llm.settings.gemini_api_key", bad_key)
        assert _has_real_gemini_key() is False

    def test_gemini_key_accepts_real_value(self, monkeypatch):
        monkeypatch.setattr("app.llm.settings.gemini_api_key", "AIzaSyRealKey123")
        assert _has_real_gemini_key() is True


# ---------------------------------------------------------------------------
# Fallback factories — structural completeness
# ---------------------------------------------------------------------------

_CORE = {
    "problem": "No easy way to find vets",
    "solution": "Vet-matching platform",
    "customer": "Pet owners",
    "differentiation": "Real-time availability",
}

_PAYLOAD = {
    "startup_idea": "Vet-matching platform",
    "target_audience": "Pet owners",
    "industry": "Pet care",
    "unique_differentiator": "Real-time availability",
}


class TestFallbacks:
    def test_core_components_keys(self):
        result = _fallback_core_components(_PAYLOAD)
        assert {"problem", "solution", "customer", "differentiation"} == set(result)

    def test_value_proposition_keys(self):
        result = _fallback_value_proposition(_CORE)
        assert {"tagline", "description"} == set(result)
        assert "Pet owners" in result["tagline"] or "customers" in result["tagline"]

    def test_customer_personas_structure(self):
        result = _fallback_customer_personas(_CORE)
        assert "personas" in result
        assert len(result["personas"]) == 2
        required = {"name", "role", "demographics", "pain_points", "goals", "solution_fit"}
        for persona in result["personas"]:
            assert required.issubset(set(persona))

    def test_competitive_analysis_structure(self):
        result = _fallback_competitive_analysis(_CORE)
        assert "competitors" in result
        assert len(result["competitors"]) >= 1
        for comp in result["competitors"]:
            assert {"type_or_name", "strengths", "weaknesses", "our_advantage"}.issubset(comp)

    def test_revenue_model_structure(self):
        result = _fallback_revenue_model(_CORE)
        assert "primary_stream" in result and "secondary_stream" in result
        assert "name" in result["primary_stream"]
        assert "description" in result["secondary_stream"]
        assert "rationale" in result

    def test_mvp_features_structure(self):
        result = _fallback_mvp_features(_CORE)
        assert isinstance(result["must_have"], list)
        assert isinstance(result["nice_to_have"], list)
        assert len(result["must_have"]) >= 1

    def test_gtm_strategy_three_channels(self):
        result = _fallback_gtm_strategy(_CORE)
        assert len(result["channels"]) == 3
        for ch in result["channels"]:
            assert {"channel_name", "target_audience", "strategy_description"}.issubset(ch)

    def test_pitch_deck_ten_slides(self):
        result = _fallback_pitch_deck({"generated_sections": {}})
        assert len(result["slides"]) == 10
        for slide in result["slides"]:
            assert {"slide_number", "title", "key_message"}.issubset(slide)

    def test_refined_plan_structure(self):
        result = _fallback_refined_plan({"generated_sections": {}})
        assert "disclaimer" in result
        assert "executive_summary" in result
        assert "refined_sections" in result
        assert "consistency_notes" in result


# ---------------------------------------------------------------------------
# _validate_plan
# ---------------------------------------------------------------------------


class TestValidatePlan:
    def _make_plan(self, include_sections: list[str]) -> dict:
        return {
            "generated_sections": {
                section: {"data": "ok"} for section in include_sections
            }
        }

    _all_sections = [
        "core_components",
        "value_proposition",
        "customer_personas",
        "competitive_analysis",
        "revenue_model",
        "mvp_feature_list",
        "go_to_market_strategy",
    ]

    def test_complete_plan(self):
        plan = self._make_plan(self._all_sections)
        refined = {"disclaimer": "AI draft"}
        result = _validate_plan(plan, refined)
        assert result["complete"] is True
        assert result["missing_sections"] == []

    def test_incomplete_plan_flags_missing(self):
        partial = self._all_sections[:-2]
        plan = self._make_plan(partial)
        result = _validate_plan(plan, {"disclaimer": "AI draft"})
        assert result["complete"] is False
        assert "go_to_market_strategy" in result["missing_sections"]

    def test_missing_disclaimer_adds_warning(self):
        plan = self._make_plan(self._all_sections)
        result = _validate_plan(plan, {})
        warning_text = " ".join(result["warnings"]).lower()
        assert "disclaimer" in warning_text

    def test_fallback_section_triggers_warning(self):
        plan = self._make_plan(self._all_sections)
        # Mark one section as having used a fallback
        plan["generated_sections"]["revenue_model"]["generation_note"] = "fallback used"
        result = _validate_plan(plan, {"disclaimer": "AI draft"})
        assert any("revenue_model" in w for w in result["warnings"])

    def test_always_includes_standard_ai_warnings(self):
        plan = self._make_plan(self._all_sections)
        result = _validate_plan(plan, {"disclaimer": "AI draft"})
        combined = " ".join(result["warnings"]).lower()
        assert "ai-generated" in combined
