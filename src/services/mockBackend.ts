import type { SimulatedAnomaly, SimulationAlert, AnomalyType } from "../types/simulationTypes";
import { findNearestSensor, getSensorsByTrack, SENSOR_NODES } from "../types/mapTypes";
import type { Detection } from "../context/SimulationContext";

export interface BackendAnalysisResponse {
    anomalyId: string;
    severity: "INFO" | "WARNING" | "CRITICAL";
    riskScore: number;
    detectingSensors: string[];
    analysis: string;
    alerts: SimulationAlert[];
    detections: Detection[];
}

const analysisMessages: Record<AnomalyType, string[]> = {
    OBSTRUCTION: [
        "Foreign object detected on track surface",
        "Debris or obstruction blocking rail path",
        "Physical barrier identified via vibration analysis",
    ],
    TAMPERING: [
        "Fishplate displacement detected",
        "Rail joint anomaly identified",
        "Track component interference detected",
    ],
    THERMAL: [
        "Abnormal heat signature detected",
        "Thermal anomaly near track infrastructure",
        "Hot spot identified requiring inspection",
    ],
    VIBRATION: [
        "Unusual vibration pattern detected",
        "Acoustic anomaly requires investigation",
        "Ground vibration outside normal parameters",
    ],
};

export async function analyzeAnomaly(
    anomaly: SimulatedAnomaly,
    fromStationCode?: string,
    toStationCode?: string
): Promise<BackendAnalysisResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const position = anomaly.position as [number, number];
    let detectingSensors: typeof SENSOR_NODES = [];

    if (fromStationCode && toStationCode) {
        detectingSensors = getSensorsByTrack(fromStationCode, toStationCode).filter((s) => s.status === "active");
    }

    if (detectingSensors.length === 0) {
        anomaly.detectedBy.forEach((sensorType) => {
            const nearest = findNearestSensor(position[0], position[1], sensorType);
            if (nearest && !detectingSensors.find((s) => s.id === nearest.id)) {
                detectingSensors.push(nearest);
            }
        });
    }

    detectingSensors = detectingSensors.slice(0, 3);
    const riskScore = 0.5 + anomaly.intensity * 0.5;
    const severity: "INFO" | "WARNING" | "CRITICAL" = riskScore > 0.85 ? "CRITICAL" : riskScore > 0.65 ? "WARNING" : "INFO";

    const messages = analysisMessages[anomaly.type];
    const analysis = messages[Math.floor(Math.random() * messages.length)];

    const timestamp = new Date().toISOString();
    const alerts: SimulationAlert[] = detectingSensors.map((sensor) => ({
        id: `ALT-${Date.now().toString(36).toUpperCase()}-${sensor.id}`,
        anomalyId: anomaly.id,
        severity,
        message: `${analysis} - ${sensor.details}`,
        sensorId: sensor.id,
        sensorType: sensor.type,
        timestamp,
        acknowledged: false,
    }));

    const detections: Detection[] = detectingSensors.map((sensor) => ({
        id: `DET-${Date.now().toString(36).toUpperCase()}-${sensor.id}`,
        anomalyId: anomaly.id,
        sensorId: sensor.id,
        sensorType: sensor.type,
        timestamp,
        riskScore,
        analysis,
    }));

    return {
        anomalyId: anomaly.id,
        severity,
        riskScore,
        detectingSensors: detectingSensors.map((s) => s.id),
        analysis,
        alerts,
        detections,
    };
}
