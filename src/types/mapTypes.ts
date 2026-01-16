import type { LatLngTuple } from "leaflet";

export interface SensorNode {
    id: string;
    type: "OFC_NODE" | "THERMAL_CAM";
    position: LatLngTuple;
    status: "active" | "faulty" | "config_failure";
    lastPing?: string;
    details?: string;
    trackSection?: string;
}

export const SENSOR_NODES: SensorNode[] = [
    { id: "SN-001", type: "OFC_NODE", position: [28.6442, 77.2167], status: "active", details: "OFC Node - Delhi Junction North", trackSection: "NDLS-DLI" },
    { id: "SN-002", type: "THERMAL_CAM", position: [28.6505, 77.2210], status: "active", details: "Thermal Cam - Sadar Bazaar", trackSection: "NDLS-DLI" },
    { id: "SN-003", type: "OFC_NODE", position: [28.6565, 77.2250], status: "active", details: "OFC Node - Chandni Chowk", trackSection: "NDLS-DLI" },
    { id: "SN-004", type: "THERMAL_CAM", position: [28.6617, 77.2286], status: "active", details: "Thermal Cam - Old Delhi Junction", trackSection: "NDLS-DLI" },
    { id: "SN-005", type: "OFC_NODE", position: [28.6200, 77.2200], status: "active", details: "OFC Node - Connaught Place", trackSection: "NDLS-NZM" },
    { id: "SN-006", type: "THERMAL_CAM", position: [28.6050, 77.2300], status: "active", details: "Thermal Cam - India Gate", trackSection: "NDLS-NZM" },
    { id: "SN-007", type: "OFC_NODE", position: [28.5970, 77.2400], status: "faulty", details: "OFC Node - Khan Market", trackSection: "NDLS-NZM" },
    { id: "SN-008", type: "THERMAL_CAM", position: [28.5894, 77.2507], status: "active", details: "Thermal Cam - Nizamuddin", trackSection: "NDLS-NZM" },
    { id: "SN-009", type: "OFC_NODE", position: [28.6300, 77.2600], status: "active", details: "OFC Node - Pragati Maidan", trackSection: "NDLS-ANVT" },
    { id: "SN-010", type: "THERMAL_CAM", position: [28.6400, 77.2900], status: "active", details: "Thermal Cam - Yamuna Bank", trackSection: "NDLS-ANVT" },
    { id: "SN-011", type: "OFC_NODE", position: [28.6508, 77.3152], status: "active", details: "OFC Node - Anand Vihar", trackSection: "NDLS-ANVT" },
    { id: "SN-012", type: "THERMAL_CAM", position: [28.6750, 77.1600], status: "active", details: "Thermal Cam - Shakur Basti", trackSection: "NDLS-SSB" },
    { id: "SN-013", type: "OFC_NODE", position: [28.6700, 77.1800], status: "config_failure", details: "OFC Node - Patel Nagar", trackSection: "NDLS-SSB" },
    { id: "SN-014", type: "THERMAL_CAM", position: [28.6644, 77.1677], status: "active", details: "Thermal Cam - Sarai Rohilla", trackSection: "NDLS-SSB" },
    { id: "SN-015", type: "OFC_NODE", position: [28.6356, 77.2432], status: "active", details: "OFC Node - Tilak Bridge", trackSection: "NDLS-TKJ" },
];

export function getSensorsByTrack(fromCode: string, toCode: string): SensorNode[] {
    const trackKey = `${fromCode}-${toCode}`;
    const reverseKey = `${toCode}-${fromCode}`;
    return SENSOR_NODES.filter((s) => s.trackSection === trackKey || s.trackSection === reverseKey);
}

export function findNearestSensor(lat: number, lng: number, sensorType?: "OFC_NODE" | "THERMAL_CAM"): SensorNode | null {
    const filtered = sensorType ? SENSOR_NODES.filter((s) => s.type === sensorType) : SENSOR_NODES;
    let nearest: SensorNode | null = null;
    let minDist = Infinity;

    for (const sensor of filtered) {
        const dist = Math.sqrt(Math.pow(lat - sensor.position[0], 2) + Math.pow(lng - sensor.position[1], 2));
        if (dist < minDist) {
            minDist = dist;
            nearest = sensor;
        }
    }
    return nearest;
}
