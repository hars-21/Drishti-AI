export interface Coordinates {
	lat: number;
	lng: number;
}

export type AlertTier = "Informational" | "Advisory" | "Emergency";

export interface Alert {
	id: string;
	tier: AlertTier;
	coordinates: Coordinates;
	audio_analysis: string;
	thermal_analysis: string;
	timestamp: string;
}

export type HardwareType = "OFC_NODE" | "THERMAL_CAM" | "LIDAR";
export type HardwareStatus = "active" | "faulty" | "config_failure";

export interface Hardware {
	id: string;
	type: HardwareType;
	coordinates: Coordinates;
	status: HardwareStatus;
}

export interface DashboardStats {
	active_hardware: number;
	faulty_hardware: number;
	total_alerts: number;
}

export type AlertLevel = "HIGH" | "LOW" | "ERROR";

export interface AnalysisResult {
	alert_level: AlertLevel;
	analysis_details: string;
	confidence: number;
}

export type ActionType = "STOP" | "SLOW" | "INFORM";

export interface ActionRequest {
	alert_id: string;
	action: ActionType;
	operator_id: string;
}

export interface ActionLog {
	id: number;
	alert_id: string;
	action: ActionType;
	timestamp: string;
}
