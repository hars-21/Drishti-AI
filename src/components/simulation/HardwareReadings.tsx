import { motion } from "framer-motion";
import { Radio, Thermometer, Volume2 } from "lucide-react";
import type { VibrationReading, ThermalReading, AudioReading } from "../../types/simulationTypes";

interface HardwareReadingsProps {
    vibrationReadings: VibrationReading[];
    thermalReadings: ThermalReading[];
    audioReadings: AudioReading[];
}

export function HardwareReadings({ vibrationReadings, thermalReadings, audioReadings }: HardwareReadingsProps) {
    const hasReadings = vibrationReadings.length > 0 || thermalReadings.length > 0 || audioReadings.length > 0;

    if (!hasReadings) {
        return (
            <div className="bg-slate-50 border-t border-slate-200 p-4">
                <div className="text-center text-slate-400 text-sm">No hardware readings - Place an anomaly to see sensor data</div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-t border-slate-200">
            <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hardware Readings</h3>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200">
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Radio className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-slate-700">OFC VIBRATION</span>
                    </div>
                    {vibrationReadings.length === 0 ? (
                        <div className="text-xs text-slate-400">No data</div>
                    ) : (
                        <div className="space-y-3">
                            {vibrationReadings.slice(0, 2).map((reading, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} className="bg-purple-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-mono text-purple-600">{reading.sensorId}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${reading.pattern === "impact" ? "bg-red-100 text-red-600" : reading.pattern === "irregular" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
                                            {reading.pattern.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                            <span>Frequency</span>
                                            <span className="font-mono font-bold text-purple-700">{reading.frequency.toFixed(1)} Hz</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(reading.frequency / 2, 100)}%` }} transition={{ duration: 0.5 }} className="h-full bg-purple-500 rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                            <span>Amplitude</span>
                                            <span className="font-mono font-bold text-purple-700">{reading.amplitude.toFixed(1)} mm</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(reading.amplitude * 6, 100)}%` }} transition={{ duration: 0.5 }} className="h-full bg-purple-400 rounded-full" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Thermometer className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-bold text-slate-700">THERMAL CAM</span>
                    </div>
                    {thermalReadings.length === 0 ? (
                        <div className="text-xs text-slate-400">No data</div>
                    ) : (
                        <div className="space-y-3">
                            {thermalReadings.slice(0, 2).map((reading, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} className="bg-orange-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-mono text-orange-600">{reading.sensorId}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${reading.signature === "fire" ? "bg-red-100 text-red-600" : reading.signature === "human" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                                            {reading.signature.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 mb-2">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">{reading.maxTemp.toFixed(0)}°</div>
                                            <div className="text-[10px] text-slate-500">Max</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-semibold text-orange-400">{reading.avgTemp.toFixed(0)}°</div>
                                            <div className="text-[10px] text-slate-500">Avg</div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        Hotspot: <span className="font-mono font-bold text-orange-700">{reading.hotspotArea.toFixed(1)} m²</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Volume2 className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-700">AUDIO SENSOR</span>
                    </div>
                    {audioReadings.length === 0 ? (
                        <div className="text-xs text-slate-400">No data</div>
                    ) : (
                        <div className="space-y-3">
                            {audioReadings.slice(0, 2).map((reading, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} className="bg-blue-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-mono text-blue-600">{reading.sensorId}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${reading.pattern === "metallic" ? "bg-red-100 text-red-600" : reading.pattern === "impact" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>
                                            {reading.pattern.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="mb-2">
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                            <span>Frequency</span>
                                            <span className="font-mono font-bold text-blue-700">{reading.frequency.toFixed(0)} Hz</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(reading.frequency / 50, 100)}%` }} transition={{ duration: 0.5 }} className="h-full bg-blue-500 rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                            <span>Amplitude</span>
                                            <span className="font-mono font-bold text-blue-700">{reading.amplitude.toFixed(1)} dB</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default HardwareReadings;
