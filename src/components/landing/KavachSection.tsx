import { motion } from "framer-motion";
import { TrainFront, Zap, Radio, Shield } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";
import { Badge } from "../ui/Badge";

export function KavachSection() {
    return (
        <Section className="bg-slate-950 text-white py-10 md:py-14 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-900/10 -skew-x-12 translate-x-20"></div>

            <PageContainer className="relative z-10">
                <motion.div
                    className="flex flex-col md:flex-row items-center justify-between gap-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="md:w-1/2">
                        <Badge variant="info" className="mb-3 bg-blue-900/50 text-blue-300 border-blue-700/50 text-[10px]">TCAS INTERFACE</Badge>
                        <h2 className="text-xl md:text-3xl font-bold mb-3 font-sans tracking-tight">Kavach 4.0 Integration</h2>
                        <p className="text-slate-400 text-sm mb-5 leading-relaxed max-w-md">
                            Direct hardware bridge to the Indian Railways Train Collision Avoidance System. Bypasses human control centers during confirmed red-flag events.
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <motion.div
                                className="p-3 bg-slate-900 rounded border border-slate-800"
                                whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.3)" }}
                            >
                                <Shield className="w-4 h-4 text-green-400 mb-1" />
                                <div className="text-[10px] text-slate-500 mb-0.5">Standard</div>
                                <div className="font-mono font-bold text-green-400 text-sm">SIL-4</div>
                            </motion.div>
                            <motion.div
                                className="p-3 bg-slate-900 rounded border border-slate-800"
                                whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.3)" }}
                            >
                                <Radio className="w-4 h-4 text-blue-400 mb-1" />
                                <div className="text-[10px] text-slate-500 mb-0.5">Transmission</div>
                                <div className="font-mono font-bold text-blue-400 text-sm">&lt;200ms</div>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        className="md:w-1/2 flex justify-center"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="relative p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex items-center gap-5 max-w-xs">
                            <div className="flex flex-col items-center gap-1.5">
                                <motion.div
                                    className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30"
                                    animate={{ boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 15px rgba(59,130,246,0.3)", "0 0 0px rgba(59,130,246,0)"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Zap className="w-5 h-5 text-blue-400" />
                                </motion.div>
                                <span className="text-[9px] font-mono text-slate-500">TRIGGER</span>
                            </div>

                            <div className="flex-1 h-px bg-slate-700 relative overflow-hidden">
                                <motion.div
                                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
                                    animate={{ x: [0, 80, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>

                            <div className="flex flex-col items-center gap-1.5">
                                <motion.div
                                    className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center border border-red-500/30"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    <TrainFront className="w-5 h-5 text-red-400" />
                                </motion.div>
                                <span className="text-[9px] font-mono text-slate-500">BRAKE</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </PageContainer>
        </Section>
    );
}
