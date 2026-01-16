import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import type { SimulatedAnomaly, SimulationAlert } from "../types/simulationTypes";
import { postAnomaly, postSimulationAlert, clearAllAnomalies, acknowledgeSimulationAlert } from "../services/api";

export interface Detection {
    id: string;
    anomalyId: string;
    sensorId: string;
    sensorType: "OFC_NODE" | "THERMAL_CAM";
    timestamp: string;
    riskScore: number;
    analysis: string;
}

type NotificationCallback = (alert: SimulationAlert) => void;

interface SimulationContextType {
    anomalies: SimulatedAnomaly[];
    alerts: SimulationAlert[];
    detections: Detection[];
    addAnomaly: (anomaly: SimulatedAnomaly) => void;
    addAlert: (alert: SimulationAlert) => void;
    addDetection: (detection: Detection) => void;
    acknowledgeAlert: (alertId: string) => void;
    clearAll: () => void;
    setNotificationCallback: (cb: NotificationCallback | null) => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

const STORAGE_KEY = "drishti_simulation_state";

function loadState(): { anomalies: SimulatedAnomaly[]; alerts: SimulationAlert[]; detections: Detection[] } {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);
    } catch { }
    return { anomalies: [], alerts: [], detections: [] };
}

function saveState(anomalies: SimulatedAnomaly[], alerts: SimulationAlert[], detections: Detection[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ anomalies, alerts, detections, timestamp: Date.now() }));
}

export function SimulationProvider({ children }: { children: ReactNode }) {
    const [anomalies, setAnomalies] = useState<SimulatedAnomaly[]>([]);
    const [alerts, setAlerts] = useState<SimulationAlert[]>([]);
    const [detections, setDetections] = useState<Detection[]>([]);
    const notificationCallbackRef = useRef<NotificationCallback | null>(null);

    useEffect(() => {
        const saved = loadState();
        setAnomalies(saved.anomalies);
        setAlerts(saved.alerts);
        setDetections(saved.detections);
    }, []);

    useEffect(() => {
        saveState(anomalies, alerts, detections);
    }, [anomalies, alerts, detections]);

    const setNotificationCallback = useCallback((cb: NotificationCallback | null) => {
        notificationCallbackRef.current = cb;
    }, []);

    const addAnomaly = useCallback((anomaly: SimulatedAnomaly) => {
        setAnomalies((prev) => [...prev, anomaly]);
        postAnomaly(anomaly).catch(console.error);
    }, []);

    const addAlert = useCallback((alert: SimulationAlert) => {
        setAlerts((prev) => [alert, ...prev]);
        postSimulationAlert(alert).catch(console.error);
        // Trigger notification via callback
        if (notificationCallbackRef.current) {
            notificationCallbackRef.current(alert);
        }
    }, []);

    const addDetection = useCallback((detection: Detection) => {
        setDetections((prev) => [...prev, detection]);
    }, []);

    const acknowledgeAlert = useCallback((alertId: string) => {
        setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)));
        acknowledgeSimulationAlert(alertId).catch(console.error);
    }, []);

    const clearAll = useCallback(() => {
        setAnomalies([]);
        setAlerts([]);
        setDetections([]);
        localStorage.removeItem(STORAGE_KEY);
        clearAllAnomalies().catch(console.error);
    }, []);

    return (
        <SimulationContext.Provider value={{
            anomalies, alerts, detections,
            addAnomaly, addAlert, addDetection, acknowledgeAlert, clearAll,
            setNotificationCallback
        }}>
            {children}
        </SimulationContext.Provider>
    );
}

export function useSimulation() {
    const context = useContext(SimulationContext);
    if (!context) throw new Error("useSimulation must be used within SimulationProvider");
    return context;
}


