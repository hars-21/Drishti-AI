import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StopCircle, Gauge, Bell, Clock, User, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { getActionHistory } from "../../services/api";
import type { ActionHistoryItem, ActionType } from "../../services/api/types";

export function ActionHistory() {
    const [history, setHistory] = useState<ActionHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const data = await getActionHistory();
                setHistory(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch action history");
            } finally {
                setIsLoading(false);
            }
        }

        fetchHistory();
        // Refresh every 30 seconds
        const interval = setInterval(fetchHistory, 30000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return <ActionHistorySkeleton />;
    }

    if (error) {
        return (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
                <p className="text-red-700 text-sm">{error}</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 text-center">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 text-sm">No actions recorded yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Action History</h3>
                <span className="text-xs text-slate-500 font-mono">{history.length} entries</span>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />

                <div className="space-y-3">
                    {history.map((item, index) => (
                        <ActionHistoryEntry key={item.id} item={item} delay={index * 0.05} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// History Entry Component
function ActionHistoryEntry({ item, delay }: { item: ActionHistoryItem; delay: number }) {
    const typeConfig = getActionTypeConfig(item.type);
    const statusConfig = getStatusConfig(item.status);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="relative flex items-start gap-4 pl-8"
        >
            {/* Timeline dot */}
            <div
                className={`absolute left-2 top-1.5 w-4 h-4 rounded-full border-2 bg-white ${typeConfig.border}`}
            >
                <typeConfig.icon className={`w-2 h-2 absolute top-0.5 left-0.5 ${typeConfig.color}`} />
            </div>

            {/* Content */}
            <div className="flex-1 pb-4 border-b border-slate-100 last:border-0">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <span className={`text-sm font-bold ${typeConfig.color}`}>
                            {item.type.toUpperCase()}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Alert: {item.alertId.slice(0, 8)}...
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <statusConfig.icon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                        <span className={`text-[10px] font-medium uppercase ${statusConfig.color}`}>
                            {item.status}
                        </span>
                    </div>
                </div>

                {item.message && (
                    <p className="text-xs text-slate-600 mt-1 italic">"{item.message}"</p>
                )}

                <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.operatorName || item.operatorId}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

// Skeleton Loader
function ActionHistorySkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 pl-8">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2 pb-4 border-b border-slate-100">
                        <div className="h-4 bg-slate-200 rounded w-1/4" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Helper Functions
function getActionTypeConfig(type: ActionType) {
    const configs = {
        stop: {
            icon: StopCircle,
            color: "text-red-600",
            border: "border-red-400",
        },
        slow: {
            icon: Gauge,
            color: "text-amber-600",
            border: "border-amber-400",
        },
        inform: {
            icon: Bell,
            color: "text-blue-600",
            border: "border-blue-400",
        },
    };
    return configs[type];
}

function getStatusConfig(status: "sent" | "acknowledged" | "failed") {
    const configs = {
        sent: {
            icon: Loader2,
            color: "text-blue-500",
        },
        acknowledged: {
            icon: CheckCircle,
            color: "text-emerald-500",
        },
        failed: {
            icon: XCircle,
            color: "text-red-500",
        },
    };
    return configs[status];
}
