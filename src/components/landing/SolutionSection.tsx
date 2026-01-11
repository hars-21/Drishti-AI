import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Video, Box, CheckCircle2, ChevronRight } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";
import { Card } from "../ui/Card";
import { cn } from "../../lib/utils";

const modes = [
    {
        id: "acoustic",
        icon: Mic,
        label: "ACOUSTIC",
        title: "Distributed Acoustic Sensing (DAS)",
        desc: "Utilizes existing Optical Fiber Cables as a continuous microphone array. Detects vibrations from rail cutting, drilling, or unauthorized walking on tracks.",
        specs: ["Sensitivity: -120dB", "Range: 40km/unit", "Latency: 2ms"],
        color: "blue"
    },
    {
        id: "thermal",
        icon: Video,
        label: "THERMAL",
        title: "YOLOv8 Infrared Vision",
        desc: "AI-powered thermal analysis verifies acoustic triggers. Identifies human heat signatures in zero-visibility conditions (fog, night).",
        specs: ["Resolution: 640x512", "Frame Rate: 60Hz", "Recognition: <50ms"],
        color: "purple"
    },
    {
        id: "lidar",
        icon: Box,
        label: "GEOMETRY",
        title: "LiDAR & Stereo Depth",
        desc: "Micron-level detection of track alignment and foreign objects. Confirms physical sabotage before engaging emergency brakes.",
        specs: ["Precision: ±2mm", "Range: 150m", "Points: 200k/sec"],
        color: "emerald"
    }
];

export function SolutionSection() {
    const [activeTab, setActiveTab] = useState(0);
    const ActiveIcon = modes[activeTab].icon;

    return (
        <Section id="solution" className="bg-white py-10 md:py-14 border-b border-slate-100">
            <PageContainer>
                <motion.div
                    className="flex flex-col lg:flex-row gap-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Left: Tabs */}
                    <div className="lg:w-1/3 space-y-2">
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Detection Modalities</div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 font-sans">Multi-Layer Intelligence</h2>
                        <div className="flex flex-col space-y-1.5">
                            {modes.map((mode, idx) => (
                                <motion.button
                                    key={mode.id}
                                    onClick={() => setActiveTab(idx)}
                                    className={cn(
                                        "flex items-center p-3 rounded-lg text-left transition-all border",
                                        activeTab === idx
                                            ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                    )}
                                    whileHover={{ scale: activeTab !== idx ? 1.02 : 1 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className={cn("p-1.5 rounded mr-3", activeTab === idx ? "bg-white/20" : "bg-slate-100")}>
                                        <mode.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-xs tracking-wide">{mode.label}</div>
                                    </div>
                                    {activeTab === idx && <ChevronRight className="w-4 h-4" />}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="lg:w-2/3">
                        <Card className="h-full bg-slate-50 border border-slate-200 overflow-hidden relative flex flex-col justify-center p-6 md:p-8">
                            {/* Background Icon */}
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <ActiveIcon className="w-48 h-48" />
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    className="relative z-10"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-widest">
                                        LAYER {activeTab + 1} // {modes[activeTab].id.toUpperCase()}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3">{modes[activeTab].title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-lg">
                                        {modes[activeTab].desc}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200 pt-4">
                                        {modes[activeTab].specs.map((spec, i) => (
                                            <motion.div
                                                key={i}
                                                className="flex items-center space-x-2"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                                                <span className="text-xs font-mono font-medium text-slate-700">{spec}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </Card>
                    </div>
                </motion.div>
            </PageContainer>
        </Section>
    );
}
