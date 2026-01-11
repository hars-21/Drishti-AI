import axios from "axios";

export const api = axios.create({
	baseURL: "http://localhost:8000",
	timeout: 6000,
});

export type HealthProbe = {
	name: string;
	state: "Nominal" | "Degraded" | "Offline";
	detail: string;
};

export type Alert = {
	id: string;
	severity: "LOW" | "MEDIUM" | "HIGH";
	timestamp: string;
	reasons: string[];
};

export type Snapshot = {
	corridors: number;
	activeAlerts: number;
	medianResponse: string;
	kavachStatus: string;
};

const mockHealth: HealthProbe[] = [
	{ name: "Inference API", state: "Nominal", detail: "Latency p95 118 ms" },
	{ name: "Camera Ingest", state: "Nominal", detail: "14 streams" },
	{ name: "DAS Collector", state: "Degraded", detail: "Span-3 recalibrating" },
	{ name: "Geometry Engine", state: "Nominal", detail: "Stereo pairs synced" },
];

const mockAlerts: Alert[] = [
	{
		id: "KGP-YD-21",
		severity: "HIGH",
		timestamp: new Date().toISOString(),
		reasons: ["Thermal mass detected", "Acoustic spike at 38 Hz", "Ballast disturbance"],
	},
];

const mockSnapshot: Snapshot = {
	corridors: 12,
	activeAlerts: 3,
	medianResponse: "42s",
	kavachStatus: "Nominal",
};

export async function fetchHealth(): Promise<HealthProbe[]> {
	try {
		const { data } = await api.get<HealthProbe[]>("/health");
		return data;
	} catch (error) {
		console.error("Error fetching health data:", error);
		return mockHealth;
	}
}

export async function fetchAlerts(): Promise<Alert[]> {
	try {
		const { data } = await api.get<Alert[]>("/alerts");
		return data;
	} catch (error) {
		console.error("Error fetching alerts data:", error);
		return mockAlerts;
	}
}

export async function fetchSnapshot(): Promise<Snapshot> {
	try {
		const { data } = await api.get<Snapshot>("/snapshot");
		return data;
	} catch (error) {
		console.error("Error fetching snapshot data:", error);
		return mockSnapshot;
	}
}
