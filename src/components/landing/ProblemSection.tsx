import { motion } from "framer-motion";
import { AlertTriangle, Clock, DollarSign, ShieldAlert } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";

const problems = [
	{
		icon: AlertTriangle,
		title: "Single-Sensor False Alarms",
		description:
			"Traditional systems trigger on animal movement, weather patterns, and environmental noise—causing frequent false positives that erode operational trust.",
		stat: "40%",
		statLabel: "False Positive Rate",
	},
	{
		icon: Clock,
		title: "Manual Verification Delays",
		description:
			"Human operators need 5-15 minutes to verify threats manually. In sabotage scenarios, every second counts towards preventing derailment.",
		stat: "8 min",
		statLabel: "Average Response Time",
	},
	{
		icon: DollarSign,
		title: "Costly Hardware Deployment",
		description:
			"Installing dedicated sensor arrays across 65,000+ km of track requires massive infrastructure investment that most railway networks cannot afford.",
		stat: "₹45L",
		statLabel: "Cost per km (Est.)",
	},
	{
		icon: ShieldAlert,
		title: "Loss of Trust in Automation",
		description:
			"When AI cries wolf repeatedly, operators disable automated safety systems—defeating the purpose of real-time threat detection entirely.",
		stat: "23%",
		statLabel: "System Disable Rate",
	},
];

export function ProblemSection() {
	return (
		<Section className="bg-slate-50 py-20 md:py-32 border-b border-slate-200">
			<PageContainer>
				{/* Section Header */}
				<motion.div
					className="max-w-2xl mb-16"
					initial={{ opacity: 0, x: -20 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 mb-4">
						<AlertTriangle className="w-3.5 h-3.5 text-red-600" />
						<span className="text-xs font-mono uppercase tracking-widest text-red-700">
							Infrastructure Gaps
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
						Why Legacy Systems Fail at Scale
					</h2>
					<p className="text-lg text-slate-600 leading-relaxed">
						Current railway safety infrastructure struggles with four fundamental challenges that
						make automated threat detection impractical.
					</p>
				</motion.div>

				{/* Vertical Problem Flow */}
				<div className="space-y-8 md:space-y-12">
					{problems.map((problem, index) => (
						<motion.div
							key={index}
							className="grid lg:grid-cols-2 gap-8 items-center"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
						>
							{/* Left: Text Content */}
							<div className="space-y-4">
								<div className="flex items-start gap-4">
									<div className="shrink-0 w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
										<problem.icon className="w-6 h-6 text-slate-600" />
									</div>
									<div className="flex-1">
										<div className="flex items-start justify-between gap-4 mb-2">
											<h3 className="text-xl md:text-2xl font-bold text-slate-900">
												{problem.title}
											</h3>
											<span className="text-xs font-mono text-slate-400 shrink-0">
												[0{index + 1}]
											</span>
										</div>
										<p className="text-slate-600 leading-relaxed">{problem.description}</p>
									</div>
								</div>
							</div>

							{/* Right: Stat Visualization */}
							<div className="relative">
								<motion.div
									className="relative p-8 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden group hover:border-slate-300 hover:shadow-md transition-all"
									whileHover={{ scale: 1.02 }}
									transition={{ duration: 0.2 }}
								>
									{/* Background Glow */}
									<div className="absolute inset-0 bg-linear-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

									{/* Stat Display */}
									<div className="relative z-10">
										<div className="text-5xl md:text-6xl font-black text-transparent bg-linear-to-br from-red-600 to-orange-600 bg-clip-text mb-2">
											{problem.stat}
										</div>
										<div className="text-sm font-mono uppercase tracking-wider text-slate-500">
											{problem.statLabel}
										</div>
									</div>

									{/* Decorative Elements */}
									<div className="absolute top-4 right-4 w-24 h-24 border border-slate-200 rounded-full opacity-50" />
									<div className="absolute bottom-4 right-4 w-16 h-16 border border-slate-200 rounded-full opacity-50" />
								</motion.div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Bottom Divider */}
				<motion.div
					className="mt-16 pt-8 border-t border-slate-200"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<p className="text-center text-slate-500 text-sm font-mono">
						These gaps create a critical need for multi-modal consensus
					</p>
				</motion.div>
			</PageContainer>
		</Section>
	);
}
