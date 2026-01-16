import { useState, useCallback } from "react";
import type { LatLngTuple, LatLngExpression } from "leaflet";
import { TrackOnlyMap } from "../../components/map/TrackOnlyMap";
import { SimulationPanel } from "../../components/simulation/SimulationPanel";
import { HardwareReadings } from "../../components/simulation/HardwareReadings";
import { useSimulation } from "../../context/SimulationContext";
import { analyzeAnomaly } from "../../services/mockBackend";
import {
	type Station,
	type AnomalyType,
	type SimulatedAnomaly,
	type VibrationReading,
	type ThermalReading,
	type AudioReading,
	type AnomalyInputValues,
	ANOMALY_DEFINITIONS,
	generateAnomalyId,
	generateReadingsForAnomaly,
} from "../../types/simulationTypes";
import { SENSOR_NODES } from "../../types/mapTypes";

export function SimulationPage() {
	const { addAnomaly, addAlert, addDetection, anomalies, alerts, acknowledgeAlert, clearAll } = useSimulation();

	const [fromStation, setFromStation] = useState<Station | null>(null);
	const [toStation, setToStation] = useState<Station | null>(null);
	const [selectedRoute, setSelectedRoute] = useState<LatLngExpression[] | null>(null);
	const [routeTrackPoints, setRouteTrackPoints] = useState<LatLngTuple[]>([]);
	const [selectedAnomalyType, setSelectedAnomalyType] = useState<AnomalyType | null>(null);
	const [vibrationReadings, setVibrationReadings] = useState<VibrationReading[]>([]);
	const [thermalReadings, setThermalReadings] = useState<ThermalReading[]>([]);
	const [audioReadings, setAudioReadings] = useState<AudioReading[]>([]);
	const [pendingInputValues, setPendingInputValues] = useState<AnomalyInputValues>({});
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const handlePlotRoute = useCallback(() => {
		if (!fromStation || !toStation) return;
		const route: LatLngExpression[] = [fromStation.position, toStation.position];
		setSelectedRoute(route);

		const fromPos = fromStation.position as [number, number];
		const toPos = toStation.position as [number, number];
		const points: LatLngTuple[] = [];
		for (let i = 0; i <= 20; i++) {
			const t = i / 20;
			points.push([fromPos[0] + (toPos[0] - fromPos[0]) * t, fromPos[1] + (toPos[1] - fromPos[1]) * t]);
		}
		setRouteTrackPoints(points);
	}, [fromStation, toStation]);

	const handleClearRoute = useCallback(() => {
		setSelectedRoute(null);
		setRouteTrackPoints([]);
		setFromStation(null);
		setToStation(null);
		setVibrationReadings([]);
		setThermalReadings([]);
		setAudioReadings([]);
		setSelectedAnomalyType(null);
		clearAll();
	}, [clearAll]);

	const handleMapClick = useCallback(
		async (latlng: LatLngTuple) => {
			if (!selectedAnomalyType) return;

			const def = ANOMALY_DEFINITIONS[selectedAnomalyType];
			const anomalyId = generateAnomalyId();

			const newAnomaly: SimulatedAnomaly = {
				id: anomalyId,
				type: selectedAnomalyType,
				position: latlng,
				intensity: 0.7 + Math.random() * 0.3,
				detectedBy: def.detectedBy,
				timestamp: new Date().toISOString(),
				description: def.description,
				resolved: false,
				inputValues: { ...pendingInputValues },
			};

			addAnomaly(newAnomaly);
			setIsAnalyzing(true);

			try {
				const response = await analyzeAnomaly(newAnomaly, fromStation?.code, toStation?.code);

				response.alerts.forEach((alert) => addAlert(alert));
				response.detections.forEach((detection) => addDetection(detection));

				const nearestSensors = SENSOR_NODES.filter((s) => response.detectingSensors.includes(s.id));
				const readings = generateReadingsForAnomaly(newAnomaly, nearestSensors);
				setVibrationReadings((prev) => [...prev, ...readings.vibration]);
				setThermalReadings((prev) => [...prev, ...readings.thermal]);
				setAudioReadings((prev) => [...prev, ...readings.audio]);
			} catch (err) {
				console.error("Analysis failed:", err);
			} finally {
				setIsAnalyzing(false);
				setSelectedAnomalyType(null);
			}
		},
		[selectedAnomalyType, pendingInputValues, fromStation, toStation, addAnomaly, addAlert, addDetection]
	);

	const handleClearAnomalies = useCallback(() => {
		setVibrationReadings([]);
		setThermalReadings([]);
		setAudioReadings([]);
		clearAll();
	}, [clearAll]);

	return (
		<div className="h-[calc(100vh-80px)] flex flex-col animate-fade-in">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h1 className="text-2xl font-extrabold text-slate-900">Track Simulation</h1>
					<p className="text-slate-500 text-sm font-medium">Test anomaly detection on railway tracks</p>
				</div>
				<div className="flex items-center gap-3">
					{isAnalyzing && (
						<span className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-full animate-pulse flex items-center gap-2">
							<div className="w-3 h-3 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
							Analyzing...
						</span>
					)}
					{anomalies.length > 0 && (
						<span className="px-3 py-1 text-xs font-bold text-amber-600 bg-amber-50 rounded-full">
							{anomalies.length} Active Anomal{anomalies.length === 1 ? "y" : "ies"}
						</span>
					)}
					{alerts.filter((a) => !a.acknowledged).length > 0 && (
						<span className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 rounded-full animate-pulse">
							{alerts.filter((a) => !a.acknowledged).length} Unacknowledged
						</span>
					)}
				</div>
			</div>

			<div className="flex-1 flex gap-4 min-h-0">
				<div className="flex-1 flex flex-col min-w-0">
					<TrackOnlyMap
						height="100%"
						selectedRoute={selectedRoute}
						fromStation={fromStation}
						toStation={toStation}
						anomalies={anomalies}
						onMapClick={handleMapClick}
						placingAnomaly={selectedAnomalyType !== null}
						trackPoints={routeTrackPoints}
					/>
				</div>

				<div className="w-80 shrink-0">
					<SimulationPanel
						fromStation={fromStation}
						toStation={toStation}
						onFromStationChange={setFromStation}
						onToStationChange={setToStation}
						onPlotRoute={handlePlotRoute}
						onClearRoute={handleClearRoute}
						routePlotted={selectedRoute !== null}
						selectedAnomalyType={selectedAnomalyType}
						onSelectAnomalyType={setSelectedAnomalyType}
						placingAnomaly={selectedAnomalyType !== null}
						anomalies={anomalies}
						alerts={alerts}
						onClearAnomalies={handleClearAnomalies}
						onAcknowledgeAlert={acknowledgeAlert}
						pendingInputValues={pendingInputValues}
						onInputValuesChange={setPendingInputValues}
					/>
				</div>
			</div>

			<div className="mt-4">
				<HardwareReadings
					vibrationReadings={vibrationReadings}
					thermalReadings={thermalReadings}
					audioReadings={audioReadings}
				/>
			</div>
		</div>
	);
}

export default SimulationPage;
