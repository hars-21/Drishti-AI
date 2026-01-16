import type { LatLngExpression } from "leaflet";

export interface Station {
    id: string;
    name: string;
    code: string;
    position: LatLngExpression;
    zone: string;
}

export interface TrackRoute {
    id: string;
    fromStation: Station;
    toStation: Station;
    path: LatLngExpression[];
    sensors: string[];
}

export type AnomalyType = "OBSTRUCTION" | "TAMPERING" | "THERMAL" | "VIBRATION";

export interface AnomalyInputValues {
    size?: number;
    weight?: number;
    temperature?: number;
    area?: number;
    frequency?: number;
    amplitude?: number;
    audioFrequency?: number;
}

export interface SimulatedAnomaly {
    id: string;
    type: AnomalyType;
    position: LatLngExpression;
    intensity: number;
    detectedBy: ("OFC_NODE" | "THERMAL_CAM")[];
    timestamp: string;
    description: string;
    resolved: boolean;
    inputValues: AnomalyInputValues;
}

export interface VibrationReading {
    sensorId: string;
    frequency: number;
    amplitude: number;
    pattern: "normal" | "impact" | "continuous" | "irregular";
    timestamp: string;
}

export interface ThermalReading {
    sensorId: string;
    maxTemp: number;
    avgTemp: number;
    hotspotArea: number;
    signature: "human" | "fire" | "machine" | "ambient";
    timestamp: string;
}

export interface AudioReading {
    sensorId: string;
    frequency: number;
    amplitude: number;
    pattern: "metallic" | "impact" | "grinding" | "normal";
    timestamp: string;
}

export type HardwareReading = VibrationReading | ThermalReading | AudioReading;

export interface SimulationAlert {
    id: string;
    anomalyId: string;
    severity: "INFO" | "WARNING" | "CRITICAL";
    message: string;
    sensorId: string;
    sensorType: "OFC_NODE" | "THERMAL_CAM";
    timestamp: string;
    acknowledged: boolean;
}

export interface SimulationState {
    active: boolean;
    selectedRoute: TrackRoute | null;
    anomalies: SimulatedAnomaly[];
    alerts: SimulationAlert[];
    vibrationReadings: VibrationReading[];
    thermalReadings: ThermalReading[];
    audioReadings: AudioReading[];
}

export const ANOMALY_DEFINITIONS: Record<AnomalyType, {
    label: string;
    description: string;
    detectedBy: ("OFC_NODE" | "THERMAL_CAM")[];
    color: string;
    inputFields: { key: keyof AnomalyInputValues; label: string; unit: string; min: number; max: number; default: number }[];
}> = {
    OBSTRUCTION: {
        label: "Track Obstruction",
        description: "Rock, debris, or object blocking the track",
        detectedBy: ["OFC_NODE"],
        color: "#ef4444",
        inputFields: [
            { key: "size", label: "Size", unit: "m", min: 0.1, max: 2, default: 0.5 },
            { key: "weight", label: "Weight", unit: "kg", min: 1, max: 500, default: 50 },
        ],
    },
    TAMPERING: {
        label: "Track Tampering",
        description: "Fishplate removal or rail displacement",
        detectedBy: ["OFC_NODE"],
        color: "#f59e0b",
        inputFields: [
            { key: "frequency", label: "Vibration Freq", unit: "Hz", min: 50, max: 200, default: 142 },
            { key: "amplitude", label: "Amplitude", unit: "mm", min: 1, max: 20, default: 8 },
        ],
    },
    THERMAL: {
        label: "Thermal Anomaly",
        description: "Fire, heat source, or human presence",
        detectedBy: ["THERMAL_CAM"],
        color: "#dc2626",
        inputFields: [
            { key: "temperature", label: "Temperature", unit: "°C", min: 30, max: 200, default: 85 },
            { key: "area", label: "Hotspot Area", unit: "m²", min: 0.1, max: 10, default: 2 },
        ],
    },
    VIBRATION: {
        label: "Vibration Pattern",
        description: "Unusual vibration or audio anomaly detected",
        detectedBy: ["OFC_NODE"],
        color: "#8b5cf6",
        inputFields: [
            { key: "frequency", label: "Vibration Freq", unit: "Hz", min: 20, max: 300, default: 85 },
            { key: "audioFrequency", label: "Audio Freq", unit: "Hz", min: 100, max: 5000, default: 1200 },
        ],
    },
};

export const STATIONS: Station[] = [
    { id: "NDLS", name: "New Delhi", code: "NDLS", position: [28.6139, 77.209], zone: "NR" },
    { id: "DLI", name: "Old Delhi Junction", code: "DLI", position: [28.6617, 77.2286], zone: "NR" },
    { id: "NZM", name: "Hazrat Nizamuddin", code: "NZM", position: [28.5894, 77.2507], zone: "NR" },
    { id: "ANVT", name: "Anand Vihar Terminal", code: "ANVT", position: [28.6508, 77.3152], zone: "NCR" },
    { id: "GZB", name: "Ghaziabad Junction", code: "GZB", position: [28.6692, 77.4538], zone: "NCR" },
    { id: "SSB", name: "Shakur Basti", code: "SSB", position: [28.6803, 77.1456], zone: "NR" },
    { id: "DSA", name: "Delhi Sarai Rohilla", code: "DSA", position: [28.6644, 77.1677], zone: "NR" },
    { id: "TKJ", name: "Tilak Bridge", code: "TKJ", position: [28.6356, 77.2432], zone: "NR" },
];

export function generateAnomalyId(): string {
    return `AN-${Date.now().toString(36).toUpperCase()}`;
}

export function generateAlertId(): string {
    return `ALT-${Date.now().toString(36).toUpperCase()}`;
}

export function getDefaultSimulationState(): SimulationState {
    return {
        active: false,
        selectedRoute: null,
        anomalies: [],
        alerts: [],
        vibrationReadings: [],
        thermalReadings: [],
        audioReadings: [],
    };
}

export function generateReadingsForAnomaly(
    anomaly: SimulatedAnomaly,
    nearestSensors: { id: string; type: "OFC_NODE" | "THERMAL_CAM" }[]
): {
    vibration: VibrationReading[];
    thermal: ThermalReading[];
    audio: AudioReading[];
} {
    const timestamp = new Date().toISOString();
    const result = {
        vibration: [] as VibrationReading[],
        thermal: [] as ThermalReading[],
        audio: [] as AudioReading[],
    };

    nearestSensors.forEach((sensor) => {
        if (sensor.type === "OFC_NODE" && (anomaly.type === "TAMPERING" || anomaly.type === "VIBRATION" || anomaly.type === "OBSTRUCTION")) {
            result.vibration.push({
                sensorId: sensor.id,
                frequency: anomaly.inputValues.frequency || 142,
                amplitude: anomaly.inputValues.amplitude || 8,
                pattern: anomaly.type === "TAMPERING" ? "impact" : "irregular",
                timestamp,
            });

            if (anomaly.inputValues.audioFrequency) {
                result.audio.push({
                    sensorId: sensor.id,
                    frequency: anomaly.inputValues.audioFrequency,
                    amplitude: anomaly.intensity * 10,
                    pattern: anomaly.type === "OBSTRUCTION" ? "impact" : "metallic",
                    timestamp,
                });
            }
        }

        if (sensor.type === "THERMAL_CAM" && anomaly.type === "THERMAL") {
            result.thermal.push({
                sensorId: sensor.id,
                maxTemp: anomaly.inputValues.temperature || 85,
                avgTemp: (anomaly.inputValues.temperature || 85) * 0.7,
                hotspotArea: anomaly.inputValues.area || 2,
                signature: (anomaly.inputValues.temperature || 85) > 100 ? "fire" : "human",
                timestamp,
            });
        }
    });

    return result;
}

const STORAGE_KEY = "drishti_simulation_data";

export function saveToLocalStorage(anomalies: SimulatedAnomaly[], alerts: SimulationAlert[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ anomalies, alerts, timestamp: Date.now() }));
}

export function loadFromLocalStorage(): { anomalies: SimulatedAnomaly[]; alerts: SimulationAlert[] } | null {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export function clearLocalStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
}
