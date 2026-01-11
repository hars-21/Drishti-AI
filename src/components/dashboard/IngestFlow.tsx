import { useState } from "react";
import { motion } from "framer-motion";
import {
    Play,
    Activity,
    CheckCircle,
    AlertTriangle,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { ingestFullCheck } from "../../services/api";
import type { IngestStep, IngestResult } from "../../services/api/types";
import { Button } from "../ui/Button";

const steps: { id: IngestStep; label: string; description: string }[] = [
    { id: "ingesting", label: "Ingest", description: "Collecting sensor data" },
    { id: "analyzing", label: "Analyze", description: "Running AI models" },
    { id: "consensus", label: "Consensus", description: "Multi-modal validation" },
    { id: "complete", label: "Complete", description: "Alert generated" },
];

interface IngestFlowProps {
    onComplete?: (result: IngestResult) => void;
}

export function IngestFlow({ onComplete }: IngestFlowProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState<IngestStep | null>(null);
    const [result, setResult] = useState<IngestResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleStartIngest = async () => {
        setIsRunning(true);
        setError(null);
        setResult(null);

        const stepOrder: IngestStep[] = ["ingesting", "analyzing", "consensus", "complete"];

        for (let i = 0; i < stepOrder.length; i++) {
            setCurrentStep(stepOrder[i]);

            if (i < stepOrder.length - 1) {
                await new Promise((r) => setTimeout(r, 1500));
            } else {
                try {
                    const data = await ingestFullCheck({
                        location: "Sector 4 - Mumbai-Pune Corridor",
                    });
                    setResult(data);
                    onComplete?.(data);
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Ingest failed");
                    setCurrentStep("error");
                }
            }
        }

        setIsRunning(false);
    };

    const handleReset = () => {
        setCurrentStep(null);
        setResult(null);
        setError(null);
    };

    const getStepStatus = (stepId: IngestStep): "pending" | "current" | "complete" | "error" => {
        if (!currentStep) return "pending";

        const currentIndex = steps.findIndex((s) => s.id === currentStep);
        const stepIndex = steps.findIndex((s) => s.id === stepId);

        if (currentStep === "error" && stepId === steps[currentIndex]?.id) return "error";
        if (stepIndex < currentIndex) return "complete";
        if (stepIndex === currentIndex) return "current";
        return "pending";
    };

    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="text-base font-bold text-slate-900">Full Sensor Ingest</h3>
                <p className="text-xs text-slate-600 mt-1">
                    Primary action: Ingest → Analyze → Consensus → Alert
                </p>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => {
                        const status = getStepStatus(step.id);
                        return (
                            <div key={step.id} className="flex items-center">
                                <StepIndicator step={step} status={status} />
                                {index < steps.length - 1 && (
                                    <ArrowRight className="w-4 h-4 text-slate-300 mx-2" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {currentStep && currentStep !== "error" && !result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200"
                    >
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            <div>
                                <p className="text-sm font-medium text-blue-800">
                                    {steps.find((s) => s.id === currentStep)?.label}
                                </p>
                                <p className="text-xs text-blue-600">
                                    {steps.find((s) => s.id === currentStep)?.description}...
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200"
                    >
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-red-800">Ingest Failed</p>
                                <p className="text-xs text-red-600">{error}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {result?.success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                            <p className="text-sm font-bold text-emerald-800">Ingest Complete</p>
                        </div>
                        {result.alertId && (
                            <p className="text-xs text-emerald-700">
                                Alert created: <span className="font-mono">{result.alertId}</span>
                            </p>
                        )}
                    </motion.div>
                )}

                <div className="flex gap-3">
                    {!isRunning && !result && (
                        <Button onClick={handleStartIngest} className="flex-1">
                            <Play className="w-4 h-4 mr-2" />
                            Start Ingest
                        </Button>
                    )}
                    {(result || error) && (
                        <Button variant="outline" onClick={handleReset} className="flex-1">
                            Run Again
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function StepIndicator({
    step,
    status,
}: {
    step: { id: IngestStep; label: string };
    status: "pending" | "current" | "complete" | "error";
}) {
    const statusClasses = {
        pending: "bg-slate-100 border-slate-200 text-slate-400",
        current: "bg-blue-100 border-blue-300 text-blue-600",
        complete: "bg-emerald-100 border-emerald-300 text-emerald-600",
        error: "bg-red-100 border-red-300 text-red-600",
    };

    return (
        <div className="flex flex-col items-center">
            <motion.div
                animate={status === "current" ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: status === "current" ? Infinity : 0 }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${statusClasses[status]}`}
            >
                {status === "complete" && <CheckCircle className="w-5 h-5" />}
                {status === "current" && <Loader2 className="w-5 h-5 animate-spin" />}
                {status === "error" && <AlertTriangle className="w-5 h-5" />}
                {status === "pending" && <Activity className="w-5 h-5" />}
            </motion.div>
            <span
                className={`text-[10px] font-medium mt-1 ${status === "pending" ? "text-slate-400" : "text-slate-700"
                    }`}
            >
                {step.label}
            </span>
        </div>
    );
}
