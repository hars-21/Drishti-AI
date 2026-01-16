import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mountain, Wrench, Thermometer, Activity, X, Radio, AlertTriangle } from "lucide-react";
import {
    STATIONS,
    ANOMALY_DEFINITIONS,
    type Station,
    type AnomalyType,
    type SimulatedAnomaly,
    type SimulationAlert,
    type AnomalyInputValues,
} from "../../types/simulationTypes";

interface SimulationPanelProps {
    fromStation: Station | null;
    toStation: Station | null;
    onFromStationChange: (station: Station | null) => void;
    onToStationChange: (station: Station | null) => void;
    onPlotRoute: () => void;
    onClearRoute: () => void;
    routePlotted: boolean;
    selectedAnomalyType: AnomalyType | null;
    onSelectAnomalyType: (type: AnomalyType | null) => void;
    placingAnomaly: boolean;
    anomalies: SimulatedAnomaly[];
    alerts: SimulationAlert[];
    onClearAnomalies: () => void;
    onAcknowledgeAlert: (alertId: string) => void;
    pendingInputValues: AnomalyInputValues;
    onInputValuesChange: (values: AnomalyInputValues) => void;
}

const iconMap = {
    OBSTRUCTION: Mountain,
    TAMPERING: Wrench,
    THERMAL: Thermometer,
    VIBRATION: Activity,
};

export function SimulationPanel({
    fromStation,
    toStation,
    onFromStationChange,
    onToStationChange,
    onPlotRoute,
    onClearRoute,
    routePlotted,
    selectedAnomalyType,
    onSelectAnomalyType,
    placingAnomaly,
    anomalies,
    alerts,
    onClearAnomalies,
    onAcknowledgeAlert,
    pendingInputValues,
    onInputValuesChange,
}: SimulationPanelProps) {
    const [showInputModal, setShowInputModal] = useState(false);
    const [tempAnomalyType, setTempAnomalyType] = useState<AnomalyType | null>(null);

    const handleAnomalySelect = (type: AnomalyType) => {
        setTempAnomalyType(type);
        const def = ANOMALY_DEFINITIONS[type];
        const defaultValues: AnomalyInputValues = {};
        def.inputFields.forEach((field) => {
            defaultValues[field.key] = field.default;
        });
        onInputValuesChange(defaultValues);
        setShowInputModal(true);
    };

    const handleConfirmAnomaly = () => {
        if (tempAnomalyType) {
            onSelectAnomalyType(tempAnomalyType);
            setShowInputModal(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-slate-200">
            <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Simulation Control</h2>
                <p className="text-xs text-slate-500 mt-0.5">Test anomaly detection system</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Route Selection</h3>

                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">From Station</label>
                        <select
                            value={fromStation?.id || ""}
                            onChange={(e) => {
                                const station = STATIONS.find((s) => s.id === e.target.value);
                                onFromStationChange(station || null);
                            }}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select station...</option>
                            {STATIONS.filter((s) => s.id !== toStation?.id).map((station) => (
                                <option key={station.id} value={station.id}>{station.name} ({station.code})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">To Station</label>
                        <select
                            value={toStation?.id || ""}
                            onChange={(e) => {
                                const station = STATIONS.find((s) => s.id === e.target.value);
                                onToStationChange(station || null);
                            }}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select station...</option>
                            {STATIONS.filter((s) => s.id !== fromStation?.id).map((station) => (
                                <option key={station.id} value={station.id}>{station.name} ({station.code})</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onPlotRoute}
                            disabled={!fromStation || !toStation}
                            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            Plot Route
                        </motion.button>
                        {routePlotted && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClearRoute}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                            >
                                Clear
                            </motion.button>
                        )}
                    </div>
                </div>

                {routePlotted && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Inject Anomaly</h3>
                        <p className="text-xs text-slate-500">Select type, set values, then click on track</p>

                        <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(ANOMALY_DEFINITIONS) as AnomalyType[]).map((type) => {
                                const def = ANOMALY_DEFINITIONS[type];
                                const Icon = iconMap[type];
                                const isSelected = selectedAnomalyType === type;
                                return (
                                    <motion.button
                                        key={type}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleAnomalySelect(type)}
                                        className={`p-3 rounded-lg border-2 text-left transition-all ${isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
                                    >
                                        <Icon className="w-5 h-5 mb-1" style={{ color: def.color }} />
                                        <div className="text-xs font-semibold text-slate-800">{def.label}</div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {placingAnomaly && (
                            <div className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg font-medium flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Click on the track to place anomaly
                            </div>
                        )}

                        {anomalies.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClearAnomalies}
                                className="w-full px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                            >
                                Clear All Anomalies ({anomalies.length})
                            </motion.button>
                        )}
                    </motion.div>
                )}

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Alerts</h3>
                        {alerts.filter((a) => !a.acknowledged).length > 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold text-red-600 bg-red-100 rounded-full animate-pulse">
                                {alerts.filter((a) => !a.acknowledged).length} NEW
                            </span>
                        )}
                    </div>

                    <AnimatePresence>
                        {alerts.length === 0 ? (
                            <div className="text-xs text-slate-400 text-center py-4">No active alerts</div>
                        ) : (
                            <div className="space-y-2">
                                {alerts.map((alert) => (
                                    <motion.div
                                        key={alert.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`p-3 rounded-lg border-l-4 ${alert.severity === "CRITICAL" ? "bg-red-50 border-red-500" : alert.severity === "WARNING" ? "bg-amber-50 border-amber-500" : "bg-blue-50 border-blue-500"} ${alert.acknowledged ? "opacity-60" : ""}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                                    <Radio className="w-3 h-3" />
                                                    {alert.sensorType.replace("_", " ")}
                                                </div>
                                                <div className="text-[11px] text-slate-600 mt-0.5">{alert.message}</div>
                                                <div className="text-[10px] text-slate-400 mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                                            </div>
                                            {!alert.acknowledged && (
                                                <button onClick={() => onAcknowledgeAlert(alert.id)} className="text-[10px] font-semibold text-blue-600 hover:text-blue-800">ACK</button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {showInputModal && tempAnomalyType && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4"
                        onClick={() => setShowInputModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Set Anomaly Values</h3>
                                <button onClick={() => setShowInputModal(false)} className="p-1 hover:bg-slate-100 rounded">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {ANOMALY_DEFINITIONS[tempAnomalyType].inputFields.map((field) => (
                                    <div key={field.key}>
                                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                                            {field.label} ({field.unit})
                                        </label>
                                        <input
                                            type="number"
                                            min={field.min}
                                            max={field.max}
                                            value={pendingInputValues[field.key] ?? field.default}
                                            onChange={(e) => onInputValuesChange({ ...pendingInputValues, [field.key]: parseFloat(e.target.value) })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="text-[10px] text-slate-400 mt-1">Range: {field.min} - {field.max} {field.unit}</div>
                                    </div>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirmAnomaly}
                                className="w-full mt-6 px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Confirm & Place on Track
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SimulationPanel;
