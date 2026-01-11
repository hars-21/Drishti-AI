import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Thermometer, Volume2, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { analyzeThermal, analyzeAudio } from "../../services/api";
import type { AnalysisResult } from "../../services/api/types";
import { Button } from "../ui/Button";

type AnalysisType = "thermal" | "audio";

export function AIAnalysisPanel() {
    const [analysisType, setAnalysisType] = useState<AnalysisType>("thermal");
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setResult(null);
            setError(null);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const analyze = analysisType === "thermal" ? analyzeThermal : analyzeAudio;
            const data = await analyze(file);
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Analysis failed");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetAnalysis = () => {
        setFile(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-base font-bold text-slate-900">Manual AI Analysis</h3>
                <p className="text-xs text-slate-500 mt-1">Upload files for threat detection</p>
            </div>

            {/* Type Toggle */}
            <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setAnalysisType("thermal");
                            resetAnalysis();
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${analysisType === "thermal"
                                ? "bg-orange-50 text-orange-700 border border-orange-200"
                                : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        <Thermometer className="w-4 h-4" />
                        Thermal
                    </button>
                    <button
                        onClick={() => {
                            setAnalysisType("audio");
                            resetAnalysis();
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${analysisType === "audio"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        <Volume2 className="w-4 h-4" />
                        Audio
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {!result ? (
                    <>
                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${isDragging
                                    ? "border-blue-400 bg-blue-50"
                                    : file
                                        ? "border-emerald-300 bg-emerald-50"
                                        : "border-slate-300 bg-slate-50 hover:border-slate-400"
                                }`}
                        >
                            <input
                                type="file"
                                accept={analysisType === "thermal" ? "image/*" : "audio/*"}
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />

                            {file ? (
                                <div className="space-y-2">
                                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="w-10 h-10 text-slate-400 mx-auto" />
                                    <p className="text-sm font-medium text-slate-600">
                                        Drop {analysisType === "thermal" ? "image" : "audio"} file here
                                    </p>
                                    <p className="text-xs text-slate-400">or click to browse</p>
                                </div>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Analyze Button */}
                        <div className="mt-4">
                            <Button
                                onClick={handleAnalyze}
                                disabled={!file || isAnalyzing}
                                className="w-full"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>Analyze {analysisType === "thermal" ? "Image" : "Audio"}</>
                                )}
                            </Button>
                        </div>
                    </>
                ) : (
                    /* Results */
                    <AnalysisResults result={result} onReset={resetAnalysis} />
                )}
            </div>
        </div>
    );
}

// Results Display Component
function AnalysisResults({
    result,
    onReset,
}: {
    result: AnalysisResult;
    onReset: () => void;
}) {
    const tierConfig = {
        emergency: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "Emergency" },
        advisory: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", label: "Advisory" },
        info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", label: "Info" },
    };

    const config = tierConfig[result.alertLevel];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
        >
            {/* Alert Level Card */}
            <div className={`p-4 rounded-xl border ${config.bg} ${config.border}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">
                        Alert Level
                    </span>
                    <AlertTriangle className={`w-5 h-5 ${config.text}`} />
                </div>
                <div className={`text-2xl font-black ${config.text}`}>{config.label.toUpperCase()}</div>
            </div>

            {/* Confidence Score */}
            <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">Confidence Score</span>
                    <span className="text-lg font-bold text-slate-900">{result.confidence}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                </div>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Analysis Explanation</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
            </div>

            {/* Detected Objects */}
            {result.detectedObjects && result.detectedObjects.length > 0 && (
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Detected Objects</h4>
                    <div className="flex flex-wrap gap-2">
                        {result.detectedObjects.map((obj, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700"
                            >
                                {obj}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Reset Button */}
            <Button variant="outline" onClick={onReset} className="w-full">
                Analyze Another File
            </Button>
        </motion.div>
    );
}
