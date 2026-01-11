import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertTriangle,
    AlertCircle,
    ShieldAlert,
    ChevronDown,
    MapPin,
    Clock,
    Activity,
    Thermometer,
    Volume2,
} from "lucide-react";
import { getAlerts } from "../../services/api";
import type { Alert, AlertTier } from "../../services/api/types";
import { Badge } from "../ui/Badge";

interface AlertsFeedProps {
    onAlertSelect?: (alert: Alert) => void;
}

export function AlertsFeed({ onAlertSelect }: AlertsFeedProps) {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAlerts() {
            try {
                const data = await getAlerts();
                setAlerts(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch alerts");
            } finally {
                setIsLoading(false);
            }
        }

        fetchAlerts();
        // Poll for updates every 10 seconds
        const interval = setInterval(fetchAlerts, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleExpand = (alert: Alert) => {
        const newId = expandedId === alert.id ? null : alert.id;
        setExpandedId(newId);
        if (newId && onAlertSelect) {
            onAlertSelect(alert);
        }
    };

    if (isLoading) {
        return <AlertsFeedSkeleton />;
    }

    if (error) {
        return (
            <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 font-medium">{error}</p>
            </div>
        );
    }

    if (alerts.length === 0) {
        return (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 text-center">
                <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">No active alerts</p>
                <p className="text-sm text-slate-500 mt-1">System monitoring in progress</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {alerts.map((alert, index) => (
                <AlertItem
                    key={alert.id}
                    alert={alert}
                    isExpanded={expandedId === alert.id}
                    onToggle={() => handleExpand(alert)}
                    delay={index * 0.05}
                />
            ))}
        </div>
    );
}

// Individual Alert Item
function AlertItem({
    alert,
    isExpanded,
    onToggle,
    delay,
}: {
    alert: Alert;
    isExpanded: boolean;
    onToggle: () => void;
    delay: number;
}) {
    const tierConfig = getTierConfig(alert.tier);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`rounded-xl border overflow-hidden transition-all ${tierConfig.border} ${tierConfig.bg}`}
        >
            {/* Header - Always visible */}
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/50 transition-colors"
            >
                {/* Tier Icon */}
                <div className={`p-2 rounded-lg ${tierConfig.iconBg}`}>
                    <tierConfig.icon className={`w-5 h-5 ${tierConfig.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-bold ${tierConfig.titleColor}`}>{alert.title}</span>
                        <Badge variant={tierConfig.badge as "error" | "warning" | "info"} className="text-[10px]">
                            {alert.tier.toUpperCase()}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                {/* Expand Icon */}
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
            </button>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-2 border-t border-slate-200/50 space-y-4">
                            {/* Description */}
                            <p className="text-sm text-slate-600">{alert.description}</p>

                            {/* Analysis Details */}
                            {alert.analysis && (
                                <div className="grid grid-cols-2 gap-3">
                                    {alert.analysis.thermal && (
                                        <AnalysisCard
                                            icon={<Thermometer className="w-4 h-4" />}
                                            label="Thermal"
                                            confidence={alert.analysis.thermal.confidence}
                                            classification={alert.analysis.thermal.classification}
                                        />
                                    )}
                                    {alert.analysis.audio && (
                                        <AnalysisCard
                                            icon={<Volume2 className="w-4 h-4" />}
                                            label="Audio"
                                            confidence={alert.analysis.audio.confidence}
                                            classification={alert.analysis.audio.classification}
                                        />
                                    )}
                                    {alert.analysis.geometry && (
                                        <AnalysisCard
                                            icon={<Activity className="w-4 h-4" />}
                                            label="Geometry"
                                            confidence={alert.analysis.geometry.confidence}
                                            classification={`${alert.analysis.geometry.deviation}mm deviation`}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Consensus Score */}
                            {alert.consensusScore !== undefined && (
                                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200">
                                    <span className="text-xs font-medium text-slate-600">Consensus Score</span>
                                    <span className="text-sm font-bold text-slate-900">{alert.consensusScore}%</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Analysis Card Sub-component
function AnalysisCard({
    icon,
    label,
    confidence,
    classification,
}: {
    icon: React.ReactNode;
    label: string;
    confidence: number;
    classification: string;
}) {
    return (
        <div className="p-3 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-500">{icon}</span>
                <span className="text-xs font-medium text-slate-700">{label}</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{confidence}%</div>
            <div className="text-xs text-slate-500 truncate">{classification}</div>
        </div>
    );
}

// Skeleton Loader
function AlertsFeedSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-1/3" />
                            <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Tier Configuration Helper
function getTierConfig(tier: AlertTier) {
    const configs = {
        emergency: {
            icon: ShieldAlert,
            bg: "bg-red-50",
            border: "border-red-200",
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            titleColor: "text-red-900",
            badge: "error",
        },
        advisory: {
            icon: AlertTriangle,
            bg: "bg-amber-50",
            border: "border-amber-200",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            titleColor: "text-amber-900",
            badge: "warning",
        },
        info: {
            icon: AlertCircle,
            bg: "bg-blue-50",
            border: "border-blue-200",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            titleColor: "text-blue-900",
            badge: "info",
        },
    };
    return configs[tier];
}
