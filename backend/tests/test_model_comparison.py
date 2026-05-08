"""
Live model comparison test — requires a real HF_TOKEN in the environment.

Run with:
    pytest tests/test_model_comparison.py -v -s --tb=short

What this measures for each model:
  - Wall-clock generation time (seconds)
  - Whether the plan is complete (no missing sections)
  - Whether any fallback content was used (LLM call failed mid-chain)
  - Count of consistency_notes in the refined plan
  - Token estimate (rough: len(output_json) / 4)

Results are printed as a side-by-side table at the end via a session-scoped
fixture so the data is visible even when some models error.

Skip automatically if HF_TOKEN is not set.
"""

import json
import os
import time
from typing import Any

import pytest
import pytest_asyncio

HF_TOKEN = os.environ.get("HF_TOKEN", "").strip()
pytestmark = pytest.mark.skipif(
    not HF_TOKEN or HF_TOKEN.lower() in {"your_token_here", "change_me", "none", "null"},
    reason="HF_TOKEN not set — skipping live model comparison tests",
)


# The idea used for every model so results are comparable
_TEST_INPUT = {
    "startup_idea": "A subscription service that matches local farmers with restaurant buyers, handling logistics and pricing.",
    "target_audience": "Independent restaurant owners and small-scale farmers",
    "industry": "AgriTech / Food Supply Chain",
    "unique_differentiator": "Real-time price negotiation engine with automated cold-chain routing",
}

_MODELS = [
    "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    "deepseek-ai/DeepSeek-V3",
    "deepseek-ai/DeepSeek-V3-0324",
    "deepseek-ai/DeepSeek-R1",
    "moonshotai/Kimi-K2.5",
    "Qwen/Qwen2.5-7B-Instruct-Turbo",
]

_REQUIRED_SECTIONS = [
    "core_components",
    "value_proposition",
    "customer_personas",
    "competitive_analysis",
    "revenue_model",
    "mvp_feature_list",
    "go_to_market_strategy",
]


# ---------------------------------------------------------------------------
# Session-level collector so we can print a summary table at the end
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def comparison_results() -> list[dict[str, Any]]:
    return []


def _count_fallbacks(steps: list[dict[str, Any]]) -> int:
    count = 0
    for step in steps:
        try:
            output = json.loads(step.get("output", "{}"))
            if "generation_note" in output:
                count += 1
        except Exception:
            pass
    return count


def _rough_token_estimate(obj: Any) -> int:
    return len(json.dumps(obj)) // 4


# ---------------------------------------------------------------------------
# One parametrized test per model
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.parametrize("model", _MODELS)
async def test_model_generates_complete_plan(model: str, comparison_results):
    from app.llm import generate_business_plan_chain

    start = time.monotonic()
    try:
        result = await generate_business_plan_chain(_TEST_INPUT, model=model)
        elapsed = round(time.monotonic() - start, 2)
        error = None
    except Exception as exc:
        elapsed = round(time.monotonic() - start, 2)
        error = str(exc)
        result = None

    # --- build comparison row ---
    if result is None:
        row = {
            "model": model,
            "elapsed_s": elapsed,
            "complete": False,
            "missing_sections": _REQUIRED_SECTIONS,
            "fallback_steps": "N/A",
            "consistency_notes": "N/A",
            "token_estimate": 0,
            "error": error,
        }
    else:
        validation = result.get("validation_result", {})
        steps = result.get("_steps", [])
        row = {
            "model": model,
            "elapsed_s": elapsed,
            "complete": validation.get("complete", False),
            "missing_sections": validation.get("missing_sections", []),
            "fallback_steps": _count_fallbacks(steps),
            "consistency_notes": len(
                result.get("refined_plan", {}).get("consistency_notes", [])
            ),
            "token_estimate": _rough_token_estimate(result),
            "error": None,
        }

    comparison_results.append(row)

    # --- assertions (soft: mark failed but keep running) ---
    if error:
        pytest.fail(f"[{model}] generation raised: {error}")

    missing = row["missing_sections"]
    assert missing == [], f"[{model}] missing sections: {missing}"

    assert row["fallback_steps"] == 0, (
        f"[{model}] {row['fallback_steps']} step(s) fell back to local stubs — "
        "check that HF_TOKEN is valid and the model is online."
    )


# ---------------------------------------------------------------------------
# Summary table printed after all parametrize variants finish
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session", autouse=True)
def print_comparison_table(comparison_results):
    yield  # let all tests run first

    if not comparison_results:
        return

    # Sort by elapsed time ascending
    rows = sorted(comparison_results, key=lambda r: r["elapsed_s"])

    col_widths = {
        "model": max(len(r["model"]) for r in rows),
        "elapsed_s": 10,
        "complete": 8,
        "fallback_steps": 14,
        "consistency_notes": 18,
        "token_estimate": 14,
        "error": 40,
    }

    def fmt(value, width):
        return str(value).ljust(width)[:width]

    header = (
        fmt("Model", col_widths["model"])
        + "  " + fmt("Time(s)", col_widths["elapsed_s"])
        + "  " + fmt("Complete", col_widths["complete"])
        + "  " + fmt("Fallback Steps", col_widths["fallback_steps"])
        + "  " + fmt("Consistency Notes", col_widths["consistency_notes"])
        + "  " + fmt("~Tokens", col_widths["token_estimate"])
        + "  " + fmt("Error", col_widths["error"])
    )
    separator = "-" * len(header)

    print("\n\n" + "=" * len(header))
    print("MODEL COMPARISON RESULTS")
    print("=" * len(header))
    print(header)
    print(separator)
    for r in rows:
        print(
            fmt(r["model"], col_widths["model"])
            + "  " + fmt(r["elapsed_s"], col_widths["elapsed_s"])
            + "  " + fmt("YES" if r["complete"] else "NO", col_widths["complete"])
            + "  " + fmt(r["fallback_steps"], col_widths["fallback_steps"])
            + "  " + fmt(r["consistency_notes"], col_widths["consistency_notes"])
            + "  " + fmt(r["token_estimate"], col_widths["token_estimate"])
            + "  " + fmt(r["error"] or "", col_widths["error"])
        )
    print("=" * len(header) + "\n")
