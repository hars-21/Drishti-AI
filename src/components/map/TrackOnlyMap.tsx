import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, CircleMarker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression, LatLngTuple } from "leaflet";
import { STATIONS, type Station, type SimulatedAnomaly, ANOMALY_DEFINITIONS } from "../../types/simulationTypes";
import { Mountain, Wrench, Thermometer, Activity } from "lucide-react";
import { renderToString } from "react-dom/server";
import "../../styles/leaflet.css";

interface TrackOnlyMapProps {
    height?: string;
    selectedRoute: LatLngExpression[] | null;
    fromStation: Station | null;
    toStation: Station | null;
    anomalies: SimulatedAnomaly[];
    onMapClick?: (latlng: LatLngTuple) => void;
    placingAnomaly?: boolean;
    trackPoints?: LatLngTuple[];
}

const stationIcon = (selected: boolean) =>
    L.divIcon({
        className: "station-marker",
        html: `<div style="width:${selected ? 20 : 14}px;height:${selected ? 20 : 14}px;background:${selected ? "#2563eb" : "#64748b"};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [selected ? 20 : 14, selected ? 20 : 14],
        iconAnchor: [selected ? 10 : 7, selected ? 10 : 7],
    });

const getAnomalyIcon = (type: SimulatedAnomaly["type"]) => {
    const iconMap = {
        OBSTRUCTION: Mountain,
        TAMPERING: Wrench,
        THERMAL: Thermometer,
        VIBRATION: Activity,
    };
    return iconMap[type];
};

const anomalyIcon = (type: SimulatedAnomaly["type"]) => {
    const def = ANOMALY_DEFINITIONS[type];
    const Icon = getAnomalyIcon(type);
    const iconHtml = renderToString(<Icon size={16} color="white" />);
    return L.divIcon({
        className: "anomaly-marker",
        html: `<div style="width:32px;height:32px;background:${def.color};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">${iconHtml}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

function MapClickHandler({ onMapClick, trackPoints }: { onMapClick: (latlng: LatLngTuple) => void; trackPoints?: LatLngTuple[] }) {
    useMapEvents({
        click(e) {
            const clickedPoint: LatLngTuple = [e.latlng.lat, e.latlng.lng];
            if (trackPoints && trackPoints.length > 0) {
                const nearestPoint = findNearestTrackPoint(clickedPoint, trackPoints);
                if (nearestPoint) {
                    onMapClick(nearestPoint);
                    return;
                }
            }
            onMapClick(clickedPoint);
        },
    });
    return null;
}

function findNearestTrackPoint(click: LatLngTuple, trackPoints: LatLngTuple[]): LatLngTuple | null {
    let nearest: LatLngTuple | null = null;
    let minDist = Infinity;
    const maxDistance = 0.005;

    for (const point of trackPoints) {
        const dist = Math.sqrt(
            Math.pow(click[0] - point[0], 2) + Math.pow(click[1] - point[1], 2)
        );
        if (dist < minDist && dist < maxDistance) {
            minDist = dist;
            nearest = point;
        }
    }
    return nearest;
}

export function TrackOnlyMap({
    height = "100%",
    selectedRoute,
    fromStation,
    toStation,
    anomalies,
    onMapClick,
    placingAnomaly = false,
    trackPoints = [],
}: TrackOnlyMapProps) {
    const [railways, setRailways] = useState<LatLngTuple[][]>([]);
    const [allTrackPoints, setAllTrackPoints] = useState<LatLngTuple[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const query = `[out:json][timeout:60];(way["railway"="rail"](28.55,77.15,28.70,77.35););out geom;`;

        fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query })
            .then((res) => res.json())
            .then((data) => {
                if (data.elements && data.elements.length > 0) {
                    const tracks: LatLngTuple[][] = [];
                    const points: LatLngTuple[] = [];
                    data.elements.forEach((el: { geometry?: { lon: number; lat: number }[] }) => {
                        if (el.geometry) {
                            const line = el.geometry.map((p) => [p.lat, p.lon] as LatLngTuple);
                            tracks.push(line);
                            points.push(...line);
                        }
                    });
                    setRailways(tracks);
                    setAllTrackPoints(points);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const center: LatLngExpression = [28.62, 77.22];
    const combinedTrackPoints = [...allTrackPoints, ...trackPoints];

    return (
        <div className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-sm ${placingAnomaly ? "cursor-crosshair" : ""}`} style={{ height }}>
            {loading && (
                <div className="absolute inset-0 bg-white/90 z-[1001] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-sm font-medium text-slate-600">Loading tracks...</span>
                    </div>
                </div>
            )}

            {placingAnomaly && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    Click on track to place anomaly
                </div>
            )}

            <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={true}>
                {placingAnomaly && onMapClick && <MapClickHandler onMapClick={onMapClick} trackPoints={combinedTrackPoints} />}

                <TileLayer attribution='&copy; <a href="https://carto.com/">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

                {railways.map((line, idx) => (
                    <Polyline key={idx} positions={line} pathOptions={{ color: "#475569", weight: 3, opacity: 0.8 }} />
                ))}

                {selectedRoute && selectedRoute.length > 1 && (
                    <Polyline positions={selectedRoute} pathOptions={{ color: "#2563eb", weight: 5, opacity: 1 }} />
                )}

                {STATIONS.map((station) => {
                    const isSelected = station.id === fromStation?.id || station.id === toStation?.id;
                    return (
                        <Marker key={station.id} position={station.position} icon={stationIcon(isSelected)}>
                            <Tooltip permanent={isSelected} direction="top" offset={[0, -10]}>
                                <div className="text-center">
                                    <div className="font-bold text-slate-800">{station.name}</div>
                                    <div className="text-xs text-slate-500">{station.code}</div>
                                </div>
                            </Tooltip>
                        </Marker>
                    );
                })}

                {anomalies.map((anomaly) => (
                    <Marker key={anomaly.id} position={anomaly.position} icon={anomalyIcon(anomaly.type)}>
                        <Tooltip direction="top" offset={[0, -16]}>
                            <div className="min-w-[160px]">
                                <div className="font-bold text-sm" style={{ color: ANOMALY_DEFINITIONS[anomaly.type].color }}>
                                    {ANOMALY_DEFINITIONS[anomaly.type].label}
                                </div>
                                <div className="text-xs text-slate-600 mt-1">{anomaly.description}</div>
                            </div>
                        </Tooltip>
                    </Marker>
                ))}

                {anomalies.map((anomaly) => (
                    <CircleMarker
                        key={`${anomaly.id}-radius`}
                        center={anomaly.position}
                        radius={20}
                        pathOptions={{ color: ANOMALY_DEFINITIONS[anomaly.type].color, fillColor: ANOMALY_DEFINITIONS[anomaly.type].color, fillOpacity: 0.2, weight: 2, dashArray: "4, 4" }}
                    />
                ))}
            </MapContainer>
        </div>
    );
}

export default TrackOnlyMap;
