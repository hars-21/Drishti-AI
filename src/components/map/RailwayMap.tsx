import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Popup, Polyline } from "react-leaflet";
import type { LatLngExpression, LatLngTuple } from "leaflet";
import L from "leaflet";
import { Radio, Thermometer, AlertTriangle } from "lucide-react";
import { renderToString } from "react-dom/server";
import { SENSOR_NODES } from "../../types/mapTypes";
import { useSimulation } from "../../context/SimulationContext";
import "../../styles/leaflet.css";

interface RailwayMapProps {
    height?: string;
}

const getSensorIcon = (type: "OFC_NODE" | "THERMAL_CAM", status: string, hasDetection: boolean) => {
    const Icon = type === "OFC_NODE" ? Radio : Thermometer;
    let color = status === "active" ? "#22c55e" : status === "faulty" ? "#ef4444" : "#f59e0b";
    if (hasDetection) color = "#dc2626";

    const iconHtml = hasDetection
        ? renderToString(<AlertTriangle size={14} color="white" />)
        : renderToString(<Icon size={14} color="white" />);

    return L.divIcon({
        className: "sensor-marker",
        html: `<div style="width:${hasDetection ? 32 : 28}px;height:${hasDetection ? 32 : 28}px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,${hasDetection ? 0.5 : 0.3});display:flex;align-items:center;justify-content:center;${hasDetection ? "animation:pulse 1.5s infinite;" : ""}">${iconHtml}</div>`,
        iconSize: [hasDetection ? 32 : 28, hasDetection ? 32 : 28],
        iconAnchor: [hasDetection ? 16 : 14, hasDetection ? 16 : 14],
    });
};

export function RailwayMap({ height = "600px" }: RailwayMapProps) {
    const { detections, anomalies } = useSimulation();
    const [showSensors, setShowSensors] = useState(true);
    const [railways, setRailways] = useState<LatLngTuple[][]>([]);
    const [loadingRailways, setLoadingRailways] = useState(true);

    const sensorDetections = new Map<string, typeof detections>();
    detections.forEach((d) => {
        if (!sensorDetections.has(d.sensorId)) sensorDetections.set(d.sensorId, []);
        sensorDetections.get(d.sensorId)!.push(d);
    });

    useEffect(() => {
        const query = `[out:json][timeout:60];(way["railway"="rail"](28.55,77.15,28.70,77.35););out geom;`;

        fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query })
            .then((res) => res.json())
            .then((data) => {
                if (data.elements && data.elements.length > 0) {
                    const tracks: LatLngTuple[][] = [];
                    data.elements.forEach((el: { geometry?: { lon: number; lat: number }[] }) => {
                        if (el.geometry) {
                            tracks.push(el.geometry.map((p) => [p.lat, p.lon] as LatLngTuple));
                        }
                    });
                    setRailways(tracks);
                }
            })
            .catch(console.error)
            .finally(() => setLoadingRailways(false));
    }, []);

    const center: LatLngExpression = [28.6300, 77.2400];

    return (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
            <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }`}</style>

            {loadingRailways && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[1001] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-sm font-medium text-slate-600">Loading railway data...</span>
                    </div>
                </div>
            )}

            <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={true}>
                <TileLayer attribution='&copy; <a href="https://carto.com/">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

                {railways.map((track, idx) => (
                    <Polyline key={idx} positions={track} pathOptions={{ color: "#1e40af", weight: 3, opacity: 0.7, dashArray: "5, 5" }} />
                ))}

                {showSensors &&
                    SENSOR_NODES.map((sensor) => {
                        const sensorDets = sensorDetections.get(sensor.id) || [];
                        const hasDetection = sensorDets.length > 0;
                        const latestDetection = sensorDets[sensorDets.length - 1];

                        return (
                            <Marker key={sensor.id} position={sensor.position} icon={getSensorIcon(sensor.type, sensor.status, hasDetection)}>
                                <Popup>
                                    <div className="min-w-[200px]">
                                        <div className="flex items-center gap-2 mb-2">
                                            {sensor.type === "OFC_NODE" ? <Radio className="w-4 h-4 text-purple-600" /> : <Thermometer className="w-4 h-4 text-orange-600" />}
                                            <span className="font-bold text-slate-800">{sensor.type.replace("_", " ")}</span>
                                        </div>
                                        <div className="text-xs text-slate-600 mb-2">{sensor.details}</div>

                                        {hasDetection && latestDetection && (
                                            <div className="mt-3 pt-3 border-t border-slate-200">
                                                <div className="flex items-center gap-1 text-red-600 font-bold text-xs mb-1">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    ANOMALY DETECTED
                                                </div>
                                                <div className="text-[11px] text-slate-700 mb-1">{latestDetection.analysis}</div>
                                                <div className="flex justify-between text-[10px]">
                                                    <span className="text-slate-500">Risk Score</span>
                                                    <span className={`font-bold ${latestDetection.riskScore > 0.8 ? "text-red-600" : latestDetection.riskScore > 0.6 ? "text-amber-600" : "text-green-600"}`}>
                                                        {(latestDetection.riskScore * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-1">{new Date(latestDetection.timestamp).toLocaleTimeString()}</div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                                            <span className={`w-2 h-2 rounded-full ${sensor.status === "active" ? "bg-green-500" : sensor.status === "faulty" ? "bg-red-500" : "bg-amber-500"}`}></span>
                                            <span className="text-[10px] font-medium text-slate-500 uppercase">{sensor.status.replace("_", " ")}</span>
                                        </div>
                                    </div>
                                </Popup>
                                <Tooltip direction="top" offset={[0, -14]}>
                                    <span className={`text-xs font-semibold ${hasDetection ? "text-red-600" : ""}`}>{sensor.id}{hasDetection ? " ⚠" : ""}</span>
                                </Tooltip>
                            </Marker>
                        );
                    })}
            </MapContainer>

            <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 p-3 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showSensors} onChange={() => setShowSensors(!showSensors)} className="w-4 h-4 rounded" />
                    <span className="text-xs font-medium text-slate-700">Show Sensors</span>
                </label>
                {detections.length > 0 && (
                    <div className="text-[10px] text-red-600 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {detections.length} Detection{detections.length > 1 ? "s" : ""} Active
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 px-4 py-2 flex gap-6">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs font-medium text-slate-600">{SENSOR_NODES.filter((s) => s.status === "active").length} Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-xs font-medium text-slate-600">{sensorDetections.size} Detecting</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-medium text-slate-600">{anomalies.length} Anomalies</span>
                </div>
            </div>
        </div>
    );
}

export default RailwayMap;
