import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Video, Box, ArrowRight, Zap } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";

const modes = [
	{
		id: "acoustic",
		icon: Mic,
		label: "ACOUSTIC",
		title: "Distributed Acoustic Sensing",
		shortTitle: "DAS",
		desc: "Existing fiber optic cables become a 40km continuous microphone array, detecting vibrations from rail cutting, drilling, or unauthorized track access.",
		specs: ["Sensitivity: -120dB", "Range: 40km/unit", "Latency: <2ms"],
		color: "blue",
		gradient: "from-blue-500 to-cyan-500",
	},
	{
		id: "thermal",
		icon: Video,
		label: "THERMAL",
		title: "YOLOv8 Infrared Vision",
		shortTitle: "Thermal AI",
		desc: "Computer vision validates acoustic triggers by identifying human heat signatures in zero-visibility conditions (fog, night, dense vegetation).",
		specs: ["Resolution: 640×512", "Frame Rate: 60Hz", "Detection: <50ms"],
		color: "purple",
		gradient: "from-purple-500 to-pink-500",
	},
	{
		id: "geometry",
		icon: Box,
		label: "GEOMETRY",
		title: "LiDAR & Stereo Depth",
		shortTitle: "LiDAR",
		desc: "Micron-level precision detects track alignment deviations and foreign objects, confirming physical sabotage before engaging emergency protocols.",
		specs: ["Precision: ±2mm", "Range: 150m", "Points: 200k/sec"],
		color: "emerald",
		gradient: "from-emerald-500 to-teal-500",
	},
];

export function SolutionSection() {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	return (
		<Section id="solution" className="bg-white py-20 md:py-32 border-b border-slate-200">
			<PageContainer>
				{/* Section Header */}
				<motion.div
					className="max-w-3xl mx-auto text-center mb-20"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 mb-4">
						<Zap className="w-3.5 h-3.5 text-blue-600" />
						<span className="text-xs font-mono uppercase tracking-widest text-blue-700">
							Detection Architecture
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
						Triple-Lock Multi-Modal Intelligence
					</h2>
					<p className="text-lg text-slate-600 leading-relaxed">
						No single sensor can stop a train. Each modality cross-validates the others, creating a
						consensus-based decision system that eliminates false positives.
					</p>
				</motion.div>

				{/* Horizontal Flow Diagram */}
				<div className="relative max-w-6xl mx-auto">
					{/* Connection Lines */}
					<div className="absolute top-1/2 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-slate-300 to-transparent hidden lg:block" />

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 relative">
						{modes.map((mode, index) => (
							<motion.div
								key={mode.id}
								className="relative"
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: index * 0.15 }}
								onMouseEnter={() => setHoveredIndex(index)}
								onMouseLeave={() => setHoveredIndex(null)}
							>
								{/* Flow Node */}
								<motion.div
									className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm cursor-pointer group overflow-hidden"
									whileHover={{
										scale: 1.05,
										borderColor: "rgba(148, 163, 184, 0.5)",
										boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
									}}
									transition={{ duration: 0.2 }}
								>
									{/* Hover Glow Effect */}
									<motion.div
										className={`absolute inset-0 bg-linear-to-br ${mode.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
										initial={false}
										animate={{ opacity: hoveredIndex === index ? 0.05 : 0 }}
									/>

									{/* Icon */}
									<div className="relative z-10 mb-4">
										<div
											className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-linear-to-br ${mode.gradient} p-0.5`}
										>
											<div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
												<mode.icon className="w-8 h-8 text-slate-700" />
											</div>
										</div>
									</div>

									{/* Content */}
									<div className="relative z-10">
										<div className="flex items-center justify-between mb-2">
											<span
												className={`text-xs font-mono font-bold uppercase tracking-widest bg-linear-to-r ${mode.gradient} bg-clip-text text-transparent`}
											>
												{mode.label}
											</span>
											<span className="text-xs font-mono text-slate-400">[{index + 1}/3]</span>
										</div>
										<h3 className="text-xl font-bold text-slate-900 mb-3">{mode.shortTitle}</h3>
										<p className="text-sm text-slate-600 leading-relaxed mb-4">{mode.desc}</p>

										{/* Specs */}
										<div className="space-y-1.5 pt-3 border-t border-slate-200">
											{mode.specs.map((spec, i) => (
												<div
													key={i}
													className="flex items-center gap-2 text-xs font-mono text-slate-500"
												>
													<div className={`w-1 h-1 rounded-full bg-linear-to-r ${mode.gradient}`} />
													{spec}
												</div>
											))}
										</div>
									</div>

									{/* Arrow indicator (desktop only) */}
									{index < modes.length - 1 && (
										<div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-20">
											<motion.div
												animate={{
													x: [0, 5, 0],
													opacity: [0.5, 1, 0.5],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut",
												}}
											>
												<ArrowRight className="w-5 h-5 text-slate-400" />
											</motion.div>
										</div>
									)}
								</motion.div>
							</motion.div>
						))}
					</div>

					{/* Consensus Output */}
					<motion.div
						className="mt-12 max-w-md mx-auto"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.5 }}
					>
						<div className="relative p-6 rounded-2xl bg-linear-to-br from-slate-50 to-white border-2 border-slate-200 text-center overflow-hidden shadow-sm">
							{/* Pulsing Background */}
							<motion.div
								className="absolute inset-0 bg-linear-to-br from-blue-50 to-purple-50"
								animate={{
									opacity: [0.3, 0.5, 0.3],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>

							<div className="relative z-10">
								<div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
									Consensus Engine
								</div>
								<div className="text-2xl font-black text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text mb-1">
									THREAT VERIFIED
								</div>
								<div className="text-sm text-slate-600">
									All modalities must agree before action
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Bottom Explanation */}
				<motion.div
					className="mt-16 max-w-2xl mx-auto text-center"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.6 }}
				>
					<p className="text-slate-500 leading-relaxed">
						This multi-layered approach ensures that environmental noise, animals, or sensor
						glitches cannot trigger false alarms—only genuine threats make it through.
					</p>
				</motion.div>
			</PageContainer>
		</Section>
	);
}
