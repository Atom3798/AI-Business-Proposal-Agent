from datetime import datetime, timezone
from typing import Any

from bson import ObjectId
from fastapi import HTTPException, status


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def serialize_doc(value: Any) -> Any:
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, list):
        return [serialize_doc(item) for item in value]
    if isinstance(value, dict):
        serialized = {}
        for key, item in value.items():
            output_key = "id" if key == "_id" else key
            serialized[output_key] = serialize_doc(item)
        return serialized
    return value


def serialize_user(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
    }


def object_id_or_404(value: str, resource_name: str = "Resource") -> ObjectId:
    if not ObjectId.is_valid(value):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource_name} not found",
        )
    return ObjectId(value)


def plan_to_document_lines(plan: dict[str, Any]) -> list[tuple[int, str]]:
    lines: list[tuple[int, str]] = [
        (0, "AI-Generated Business Plan Draft"),
        (1, f"Startup idea: {plan.get('startup_idea', '')}"),
        (1, f"Target audience: {plan.get('target_audience', '')}"),
        (1, f"Industry: {plan.get('industry', '')}"),
        (1, f"Unique differentiator: {plan.get('unique_differentiator', '')}"),
    ]

    generated_sections = plan.get("generated_sections", {})
    refined_plan = plan.get("refined_plan", {})
    pitch_deck_outline = plan.get("pitch_deck_outline", {})

    section_order = [
        ("Value Proposition", generated_sections.get("value_proposition")),
        ("Customer Personas", generated_sections.get("customer_personas")),
        ("Competitive Analysis", generated_sections.get("competitive_analysis")),
        ("Revenue Model", generated_sections.get("revenue_model")),
        ("MVP Feature List", generated_sections.get("mvp_feature_list")),
        ("Go-To-Market Strategy", generated_sections.get("go_to_market_strategy")),
        ("Pitch Deck Outline", pitch_deck_outline),
        ("Refined Plan", refined_plan),
    ]

    for title, content in section_order:
        lines.append((0, title))
        lines.extend(_content_to_lines(content, level=1))

    lines.append(
        (
            1,
            "Disclaimer: This document is an AI-generated draft. Validate all claims, "
            "market assumptions, and financial details with real research before use.",
        )
    )
    return lines


def _content_to_lines(content: Any, level: int) -> list[tuple[int, str]]:
    if content is None:
        return [(level, "Not provided.")]
    if isinstance(content, str):
        return [(level, content)]
    if isinstance(content, list):
        lines: list[tuple[int, str]] = []
        for item in content:
            lines.extend(_content_to_lines(item, level))
        return lines
    if isinstance(content, dict):
        lines = []
        for key, value in content.items():
            title = key.replace("_", " ").title()
            if isinstance(value, (dict, list)):
                lines.append((level, title))
                lines.extend(_content_to_lines(value, level + 1))
            else:
                lines.append((level, f"{title}: {value}"))
        return lines
    return [(level, str(content))]
