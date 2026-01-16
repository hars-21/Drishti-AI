import type {
	Alert,
	DashboardStats,
	Hardware,
	AnalysisResult,
	ActionRequest,
	ActionLog,
} from "../types";
import type { SimulatedAnomaly, SimulationAlert } from "../types/simulationTypes";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

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

export async function getAlerts(): Promise<Alert[]> {
	return fetchApi<Alert[]>("/alerts");
}

export async function getStats(): Promise<DashboardStats> {
	return fetchApi<DashboardStats>("/stats");
}

export async function searchHardware(
	lat: number,
	lng: number,
	radiusKm: number = 1.0
): Promise<Hardware[]> {
	return fetchApi<Hardware[]>(`/hardware/search?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`);
}

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

export async function postAnomaly(anomaly: SimulatedAnomaly): Promise<{ success: boolean; id: string }> {
	try {
		const response = await fetchApi<{ success: boolean; id: string }>("/anomalies", {
			method: "POST",
			body: JSON.stringify({
				id: anomaly.id,
				type: anomaly.type,
				position: anomaly.position,
				intensity: anomaly.intensity,
				inputValues: anomaly.inputValues,
				timestamp: anomaly.timestamp,
			}),
		});
		return response;
	} catch {
		console.log("Backend not available, using localStorage");
		return { success: true, id: anomaly.id };
	}
}

export async function getAnomalies(): Promise<SimulatedAnomaly[]> {
	try {
		return await fetchApi<SimulatedAnomaly[]>("/anomalies");
	} catch {
		console.log("Backend not available for anomalies");
		return [];
	}
}

export async function deleteAnomaly(id: string): Promise<{ success: boolean }> {
	try {
		return await fetchApi<{ success: boolean }>(`/anomalies/${id}`, {
			method: "DELETE",
		});
	} catch {
		console.log("Backend not available for delete");
		return { success: false };
	}
}

export async function clearAllAnomalies(): Promise<{ success: boolean }> {
	try {
		return await fetchApi<{ success: boolean }>("/anomalies", {
			method: "DELETE",
		});
	} catch {
		return { success: false };
	}
}

export async function getSimulationAlerts(): Promise<SimulationAlert[]> {
	try {
		return await fetchApi<SimulationAlert[]>("/anomalies/alerts");
	} catch {
		return [];
	}
}

export async function postSimulationAlert(alert: SimulationAlert): Promise<{ success: boolean }> {
	try {
		return await fetchApi<{ success: boolean }>("/anomalies/alerts", {
			method: "POST",
			body: JSON.stringify(alert),
		});
	} catch {
		return { success: false };
	}
}

export async function acknowledgeSimulationAlert(alertId: string): Promise<{ success: boolean }> {
	try {
		return await fetchApi<{ success: boolean }>(`/anomalies/alerts/${alertId}/acknowledge`, {
			method: "PATCH",
		});
	} catch {
		return { success: false };
	}
}

export async function getAllHardware(): Promise<Hardware[]> {
	try {
		return await fetchApi<Hardware[]>("/hardware");
	} catch {
		console.log("Backend not available for hardware");
		return [];
	}
}

