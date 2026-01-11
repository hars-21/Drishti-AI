import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Camera, Radio, Thermometer, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { searchHardware } from "../../services/api";
import type { Hardware, HardwareType, HardwareStatus } from "../../services/api/types";

interface HardwareProximityProps {
    alertId?: string;
    lat?: number;
    lng?: number;
}

export function HardwareProximity({ alertId, lat, lng }: HardwareProximityProps) {
    const [hardware, setHardware] = useState<Hardware[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!alertId && !lat) return;

        async function fetchHardware() {
            setIsLoading(true);
            try {
                const data = await searchHardware({ alertId, lat, lng, radius: 5000 });
                setHardware(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch hardware");
            } finally {
                setIsLoading(false);
            }
        }

        fetchHardware();
    }, [alertId, lat, lng]);

    if (!alertId && !lat) {
        return (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 text-center">
                <Radio className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">Select an alert to view nearby hardware</p>
            </div>
        );
    }

    if (isLoading) {
        return <HardwareProximitySkeleton />;
    }

    if (error) {
        return (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
                <p className="text-red-700 text-sm">{error}</p>
            </div>
        );
    }

    if (hardware.length === 0) {
        return (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 text-center">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">No hardware found in proximity</p>
            </div>
        );
    }

    // Group by type
    const grouped = hardware.reduce(
        (acc, hw) => {
            if (!acc[hw.type]) acc[hw.type] = [];
            acc[hw.type].push(hw);
            return acc;
        },
        {} as Record<HardwareType, Hardware[]>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Nearby Hardware</h3>
                <span className="text-xs text-slate-500 font-mono">{hardware.length} devices</span>
            </div>

            <div className="space-y-3">
                {Object.entries(grouped).map(([type, items], groupIndex) => (
                    <motion.div
                        key={type}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center gap-2">
                            <HardwareTypeIcon type={type as HardwareType} />
                            <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                                {formatHardwareType(type as HardwareType)}
                            </span>
                            <span className="text-xs text-slate-400">({items.length})</span>
                        </div>

                        <div className="grid gap-2">
                            {items.map((hw, index) => (
                                <HardwareCard key={hw.id} hardware={hw} delay={index * 0.05} />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// Hardware Card Component
function HardwareCard({ hardware, delay }: { hardware: Hardware; delay: number }) {
    const statusConfig = getStatusConfig(hardware.status);

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors"
        >
            <statusConfig.icon className={`w-4 h-4 ${statusConfig.color}`} />
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">{hardware.name}</div>
                <div className="text-xs text-slate-500 truncate">{hardware.location}</div>
            </div>
            <div
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text}`}
            >
                {hardware.status}
            </div>
        </motion.div>
    );
}

// Hardware Type Icon
function HardwareTypeIcon({ type }: { type: HardwareType }) {
    const icons = {
        ofc_node: <Cpu className="w-3.5 h-3.5 text-blue-500" />,
        camera: <Camera className="w-3.5 h-3.5 text-purple-500" />,
        lidar: <Radio className="w-3.5 h-3.5 text-emerald-500" />,
        thermal: <Thermometer className="w-3.5 h-3.5 text-orange-500" />,
    };
    return icons[type] || <Cpu className="w-3.5 h-3.5 text-slate-500" />;
}

// Skeleton Loader
function HardwareProximitySkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-100">
                    <div className="w-4 h-4 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-1">
                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Helper Functions
function formatHardwareType(type: HardwareType): string {
    const labels = {
        ofc_node: "OFC Nodes",
        camera: "Cameras",
        lidar: "LiDAR",
        thermal: "Thermal Sensors",
    };
    return labels[type] || type;
}

function getStatusConfig(status: HardwareStatus) {
    const configs = {
        active: {
            icon: CheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            text: "text-emerald-700",
        },
        faulty: {
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50",
            text: "text-red-700",
        },
        offline: {
            icon: AlertCircle,
            color: "text-slate-400",
            bg: "bg-slate-100",
            text: "text-slate-600",
        },
        maintenance: {
            icon: AlertCircle,
            color: "text-amber-500",
            bg: "bg-amber-50",
            text: "text-amber-700",
        },
    };
    return configs[status];
}
