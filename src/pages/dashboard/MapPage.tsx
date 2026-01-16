import { motion } from "framer-motion";
import { Map, RefreshCw, Radio, Thermometer } from "lucide-react";
import { RailwayMap } from "../../components/map/RailwayMap";
import { SENSOR_NODES } from "../../types/mapTypes";

export function MapPage() {
    const activeSensors = SENSOR_NODES.filter((s) => s.status === "active").length;
    const ofcNodes = SENSOR_NODES.filter((s) => s.type === "OFC_NODE").length;
    const thermalCams = SENSOR_NODES.filter((s) => s.type === "THERMAL_CAM").length;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Network Map</h1>
                    <p className="text-slate-500 text-sm font-medium">Real-time sensor network monitoring</p>
                </div>
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                    >
                        <Map className="w-4 h-4" />
                        Center View
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh Data
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Radio className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-slate-900">{ofcNodes}</div>
                        <div className="text-xs font-medium text-slate-500">OFC Nodes</div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Thermometer className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-slate-900">{thermalCams}</div>
                        <div className="text-xs font-medium text-slate-500">Thermal Cams</div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-slate-900">{activeSensors}</div>
                        <div className="text-xs font-medium text-slate-500">Active</div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-purple-600">%</span>
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-slate-900">{Math.round((activeSensors / SENSOR_NODES.length) * 100)}%</div>
                        <div className="text-xs font-medium text-slate-500">Coverage</div>
                    </div>
                </div>
            </div>

            <RailwayMap height="calc(100vh - 320px)" />
        </div>
    );
}

export default MapPage;
