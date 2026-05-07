import {
  GeneratePlanPayload,
  GeneratePlanResponse,
  mapBackendPlanToSavedPlan
} from "./planMappers";
import { SavedPlan } from "./storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function apiRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {})
    }
  });

  if (!response.ok) {
    let message = "Request failed.";
    try {
      const errorPayload = (await response.json()) as { detail?: string };
      message = errorPayload.detail ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function generateBusinessPlan(
  payload: GeneratePlanPayload,
  token: string
): Promise<GeneratePlanResponse> {
  return apiRequest<GeneratePlanResponse>("/generate", token, {
    method: "POST",
    body: JSON.stringify({
      startup_idea: payload.startupIdea,
      target_audience: payload.targetAudience,
      industry: payload.industry,
      unique_differentiator: payload.uniqueDifferentiator
    })
  });
}

export async function listPlans(token: string): Promise<SavedPlan[]> {
  const response = await apiRequest<{ plans: unknown[] }>("/plans", token);
  return response.plans.map(mapBackendPlanToSavedPlan);
}

export async function deleteBackendPlan(planId: string, token: string): Promise<void> {
  await apiRequest<void>(`/plans/${planId}`, token, { method: "DELETE" });
}

export async function downloadBackendExport(
  planId: string,
  format: "pdf" | "docx",
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/export/${format}/${planId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to export ${format.toUpperCase()}.`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `business-plan-${planId}.${format}`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function submitPlanFeedback(
  planId: string,
  token: string,
  payload: {
    clarity_score: number;
    coherence_score: number;
    completeness_score: number;
    feasibility_score: number;
    usefulness_score: number;
    comments: string;
  }
): Promise<void> {
  await apiRequest(`/feedback/${planId}`, token, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
