import { GeneratePlanPayload, GeneratePlanResponse } from "./planMappers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function generateBusinessPlan(
  payload: GeneratePlanPayload
): Promise<GeneratePlanResponse> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      startup_idea: payload.startupIdea,
      target_audience: payload.targetAudience,
      industry: payload.industry,
      unique_differentiator: payload.uniqueDifferentiator,
      refine: payload.refine ?? false
    })
  });

  if (!response.ok) {
    let message = "Failed to generate business plan.";

    try {
      const errorPayload = (await response.json()) as { detail?: string };
      if (errorPayload.detail) {
        message = errorPayload.detail;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return (await response.json()) as GeneratePlanResponse;
}
