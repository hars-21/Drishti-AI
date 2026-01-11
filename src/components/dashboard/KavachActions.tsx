import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StopCircle, Gauge, Bell, AlertTriangle, CheckCircle, Loader2, X } from "lucide-react";
import { notifyAction } from "../../services/api";
import type { ActionType } from "../../services/api/types";
import { Button } from "../ui/Button";

interface KavachActionsProps {
    alertId: string;
    onActionComplete?: () => void;
}

export function KavachActions({ alertId, onActionComplete }: KavachActionsProps) {
    const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const actions = [
        {
            type: "stop" as ActionType,
            label: "STOP",
            description: "Emergency brake all trains in sector",
            icon: StopCircle,
            variant: "danger" as const,
            bg: "bg-red-50",
            border: "border-red-200",
            hoverBg: "hover:bg-red-100",
            iconColor: "text-red-600",
        },
        {
            type: "slow" as ActionType,
            label: "SLOW",
            description: "Reduce speed to 30km/h",
            icon: Gauge,
            variant: "secondary" as const,
            bg: "bg-amber-50",
            border: "border-amber-200",
            hoverBg: "hover:bg-amber-100",
            iconColor: "text-amber-600",
        },
        {
            type: "inform" as ActionType,
            label: "INFORM",
            description: "Alert driver and control room",
            icon: Bell,
            variant: "secondary" as const,
            bg: "bg-blue-50",
            border: "border-blue-200",
            hoverBg: "hover:bg-blue-100",
            iconColor: "text-blue-600",
        },
    ];

    const handleActionClick = (action: ActionType) => {
        setSelectedAction(action);
        setIsConfirmOpen(true);
        setResult(null);
    };

    const handleConfirm = async () => {
        if (!selectedAction) return;

        setIsSubmitting(true);
        try {
            await notifyAction({ type: selectedAction, alertId });
            setResult({ success: true, message: `${selectedAction.toUpperCase()} command sent successfully` });
            onActionComplete?.();
        } catch (err) {
            setResult({
                success: false,
                message: err instanceof Error ? err.message : "Failed to send command",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setIsConfirmOpen(false);
        setSelectedAction(null);
        setResult(null);
    };

    const selectedConfig = actions.find((a) => a.type === selectedAction);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Kavach Control Actions</h3>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Alert: {alertId.slice(0, 8)}
                </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
                {actions.map((action) => (
                    <motion.button
                        key={action.type}
                        onClick={() => handleActionClick(action.type)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${action.bg} ${action.border} ${action.hoverBg}`}
                    >
                        <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                        <span className={`text-sm font-bold ${action.iconColor}`}>{action.label}</span>
                    </motion.button>
                ))}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isConfirmOpen && selectedConfig && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className={`px-6 py-4 ${selectedConfig.bg} border-b border-slate-200`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <selectedConfig.icon className={`w-6 h-6 ${selectedConfig.iconColor}`} />
                                        <h4 className={`text-lg font-bold ${selectedConfig.iconColor}`}>
                                            {selectedConfig.label} Command
                                        </h4>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {!result ? (
                                    <>
                                        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 mb-6">
                                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-amber-800">
                                                    Confirm {selectedConfig.label} Action
                                                </p>
                                                <p className="text-sm text-amber-700 mt-1">
                                                    {selectedConfig.description}. This action requires operator confirmation.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button variant="outline" onClick={handleClose} className="flex-1">
                                                Cancel
                                            </Button>
                                            <Button
                                                variant={selectedConfig.variant}
                                                onClick={handleConfirm}
                                                disabled={isSubmitting}
                                                className="flex-1"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>Confirm {selectedConfig.label}</>
                                                )}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center"
                                    >
                                        {result.success ? (
                                            <>
                                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                                <p className="text-lg font-bold text-slate-900 mb-1">Command Sent</p>
                                                <p className="text-sm text-slate-600">{result.message}</p>
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                                <p className="text-lg font-bold text-slate-900 mb-1">Command Failed</p>
                                                <p className="text-sm text-red-600">{result.message}</p>
                                            </>
                                        )}

                                        <Button onClick={handleClose} className="mt-6 w-full">
                                            Close
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
