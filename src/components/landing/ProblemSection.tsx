import { motion } from "framer-motion";
import { AlertTriangle, Ear, Eye, Zap } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const threats = [
    {
        icon: AlertTriangle,
        code: "ERR-01",
        title: "MANUAL PATROL FAILURE",
        stat: "24h Interval",
        description: "Human inspection frequency insufficient for real-time threat interception.",
    },
    {
        icon: Ear,
        code: "ERR-02",
        title: "ACOUSTIC NOISE",
        stat: "40% False Pos.",
        description: "Single-modal DAS triggers on environmental noise (animals, weather).",
    },
    {
        icon: Eye,
        code: "ERR-03",
        title: "VISUAL BLINDSPOTS",
        stat: "0 Lux",
        description: "Standard CCTV ineffective in low-light, fog, or remote track segments.",
    },
    {
        icon: Zap,
        code: "ERR-04",
        title: "LATENCY DELAY",
        stat: "> 5 Min",
        description: "Manual signaling response time exceeds critical safety windows.",
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function ProblemSection() {
    return (
        <Section className="bg-slate-50/50 py-10 md:py-14">
            <PageContainer>
                <motion.div
                    className="flex flex-col md:flex-row items-end justify-between mb-6 border-b border-slate-200 pb-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">⚠ Current Vulnerabilities</h2>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Legacy Infrastructure Gaps</h3>
                    </div>
                    <div className="text-right hidden md:block font-mono text-[10px] text-slate-400">
                        THREAT ANALYSIS // REV 3.2
                    </div>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {threats.map((t, index) => (
                        <motion.div key={index} variants={item}>
                            <Card className="h-full border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 group">
                                <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
                                    <div className="p-2 bg-slate-100 rounded text-slate-500 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                                        <t.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[9px] font-mono font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">{t.code}</span>
                                </CardHeader>
                                <CardContent className="p-3 pt-1">
                                    <CardTitle className="text-xs font-bold text-slate-800 mb-0.5">{t.title}</CardTitle>
                                    <div className="text-[10px] font-bold text-slate-400 mb-1.5 font-mono">{t.stat}</div>
                                    <p className="text-[11px] text-slate-600 leading-relaxed">{t.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </PageContainer>
        </Section>
    );
}
