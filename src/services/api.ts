import type {
	Alert,
	DashboardStats,
	Hardware,
	AnalysisResult,
	ActionRequest,
	ActionLog,
} from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// Helper for fetch with error handling
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

// === Alerts & Dashboard ===

export async function getAlerts(): Promise<Alert[]> {
	return fetchApi<Alert[]>("/alerts");
}

export async function getStats(): Promise<DashboardStats> {
	return fetchApi<DashboardStats>("/stats");
}

// === Hardware ===

export async function searchHardware(
	lat: number,
	lng: number,
	radiusKm: number = 1.0
): Promise<Hardware[]> {
	return fetchApi<Hardware[]>(`/hardware/search?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`);
}

// === Analysis ===

export async function analyzeThermal(file: File): Promise<AnalysisResult> {
	const formData = new FormData();
	formData.append("file", file);

	const response = await fetch(`${API_BASE}/analyze/thermal`, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.status}`);
	}

	return response.json();
}

export async function analyzeAudio(file: File): Promise<AnalysisResult> {
	const formData = new FormData();
	formData.append("file", file);

	const response = await fetch(`${API_BASE}/analyze/audio`, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.status}`);
	}

	return response.json();
}

// === Control Center Actions ===

export async function notifyControlCenter(
	request: ActionRequest
): Promise<{ status: string; message: string }> {
	return fetchApi<{ status: string; message: string }>("/actions/notify", {
		method: "POST",
		body: JSON.stringify(request),
	});
}

export async function getActionHistory(): Promise<ActionLog[]> {
	return fetchApi<ActionLog[]>("/actions/history");
}

// === Full Sensor Ingestion ===

export async function ingestFullCheck(
	lat: number,
	lng: number,
	audio: File,
	image: File
): Promise<Alert> {
	const formData = new FormData();
	formData.append("audio", audio);
	formData.append("image", image);

	const response = await fetch(`${API_BASE}/ingest/full-check?lat=${lat}&lng=${lng}`, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.status}`);
	}

	return response.json();
}
