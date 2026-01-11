import { motion } from "framer-motion";
import { ArrowRight, Filter, ShieldCheck, Activity } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";
import { Card } from "../ui/Card";

export function ConsensusSection() {
    return (
        <Section className="bg-slate-50/50 py-10 md:py-14 border-b border-slate-100">
            <PageContainer>
                <motion.div
                    className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex-1 space-y-3">
                        <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Logic Architecture</h2>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 font-sans">
                            Consensus Verification
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Signals must pass through strict boolean validation. Inter-modal correlation determines "Truth Value" of an alert, filtering 99.9% of benign anomalies.
                        </p>

                        <div className="pt-3 font-mono text-[11px] space-y-1.5 bg-slate-900 rounded-lg p-4 text-slate-300">
                            <div className="flex justify-between">
                                <span className="text-slate-500">acoustic_trigger()</span>
                                <span className="text-green-400">TRUE</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">thermal_confirm(obj)</span>
                                <span className="text-green-400">TRUE</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">geo_violation(delta)</span>
                                <span className="text-green-400">TRUE</span>
                            </div>
                            <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between font-bold">
                                <span className="text-white">EMERGENCY_INTERLOCK</span>
                                <motion.span
                                    className="text-red-400"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    EXECUTING
                                </motion.span>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        className="flex-1 w-full"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Card className="p-5 border border-slate-200 bg-white relative overflow-hidden">
                            <div className="flex items-center justify-between gap-2 max-w-xs mx-auto">
                                {/* Flow Diagram */}
                                <motion.div
                                    className="flex flex-col items-center gap-1.5"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded flex items-center justify-center shadow-sm">
                                        <Activity className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-400">RAW</span>
                                </motion.div>

                                <ArrowRight className="text-slate-300 w-4 h-4" />

                                <motion.div
                                    className="flex flex-col items-center gap-1.5"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded flex items-center justify-center shadow-sm">
                                        <Filter className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-[9px] font-mono text-blue-600 font-bold">DWT</span>
                                </motion.div>

                                <ArrowRight className="text-slate-300 w-4 h-4" />

                                <motion.div
                                    className="flex flex-col items-center gap-1.5"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <div className="w-10 h-10 bg-green-100 border border-green-200 rounded flex items-center justify-center shadow-sm relative">
                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-mono text-green-600 font-bold">OK</span>
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            </PageContainer>
        </Section>
    );
}
