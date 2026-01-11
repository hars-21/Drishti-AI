import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldCheck, TrendingDown, CheckCircle2, XCircle } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";

type Mode = "single" | "triple";

const singleSensorData = {
	acoustic: { confidence: 85, triggered: true },
	thermal: { confidence: 45, triggered: false },
	geometry: { confidence: 30, triggered: false },
	finalDecision: "ALERT TRIGGERED",
	falsePositive: true,
};

const tripleLockData = {
	acoustic: { confidence: 85, triggered: true },
	thermal: { confidence: 45, triggered: false },
	geometry: { confidence: 30, triggered: false },
	finalDecision: "NO ACTION",
	falsePositive: false,
};

export function ConsensusSection() {
	const [mode, setMode] = useState<Mode>("single");
	const data = mode === "single" ? singleSensorData : tripleLockData;

	return (
		<Section className="bg-slate-50 py-20 md:py-32 border-b border-slate-200">
			<PageContainer>
				{/* Section Header */}
				<motion.div
					className="max-w-3xl mx-auto text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 mb-4">
						<Activity className="w-3.5 h-3.5 text-purple-600" />
						<span className="text-xs font-mono uppercase tracking-widest text-purple-700">
							Consensus Logic
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
						Why Consensus Matters
					</h2>
					<p className="text-lg text-slate-600 leading-relaxed">
						See how multi-modal validation eliminates false positives that plague single-sensor
						systems.
					</p>
				</motion.div>

				{/* Toggle Switch */}
				<motion.div
					className="flex justify-center mb-12"
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
						<button
							onClick={() => setMode("single")}
							className={`relative px-6 py-3 rounded-lg font-bold text-sm transition-all ${
								mode === "single"
									? "bg-slate-100 text-slate-900 shadow-sm"
									: "text-slate-500 hover:text-slate-700"
							}`}
						>
							{mode === "single" && (
								<motion.div
									layoutId="activeTab"
									className="absolute inset-0 bg-slate-100 rounded-lg"
									transition={{ type: "spring", duration: 0.5 }}
								/>
							)}
							<span className="relative z-10">Single Sensor</span>
						</button>
						<button
							onClick={() => setMode("triple")}
							className={`relative px-6 py-3 rounded-lg font-bold text-sm transition-all ${
								mode === "triple"
									? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
									: "text-slate-500 hover:text-slate-700"
							}`}
						>
							{mode === "triple" && (
								<motion.div
									layoutId="activeTab"
									className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg"
									transition={{ type: "spring", duration: 0.5 }}
								/>
							)}
							<span className="relative z-10">Triple-Lock</span>
						</button>
					</div>
				</motion.div>

				{/* Main Content */}
				<div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
					{/* Left: Confidence Meters */}
					<AnimatePresence mode="wait">
						<motion.div
							key={mode}
							className="space-y-6"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.4 }}
						>
							<div className="space-y-4">
								{/* Acoustic */}
								<ConfidenceMeter
									label="Acoustic (DAS)"
									confidence={data.acoustic.confidence}
									triggered={data.acoustic.triggered}
									delay={0}
								/>

								{/* Thermal */}
								<ConfidenceMeter
									label="Thermal (YOLO)"
									confidence={data.thermal.confidence}
									triggered={data.thermal.triggered}
									delay={0.1}
								/>

								{/* Geometry */}
								<ConfidenceMeter
									label="Geometry (LiDAR)"
									confidence={data.geometry.confidence}
									triggered={data.geometry.triggered}
									delay={0.2}
								/>
							</div>

							{/* Decision Output */}
							<motion.div
								className={`relative p-6 rounded-2xl border-2 overflow-hidden ${
									data.falsePositive
										? "border-red-300 bg-red-50"
										: "border-emerald-300 bg-emerald-50"
								}`}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3 }}
							>
								<div className="flex items-center justify-between mb-3">
									<span className="text-xs font-mono text-slate-600 uppercase tracking-widest">
										Final Decision
									</span>
									{data.falsePositive ? (
										<XCircle className="w-5 h-5 text-red-600" />
									) : (
										<CheckCircle2 className="w-5 h-5 text-emerald-600" />
									)}
								</div>
								<div
									className={`text-2xl font-black mb-2 ${
										data.falsePositive ? "text-red-700" : "text-emerald-700"
									}`}
								>
									{data.finalDecision}
								</div>
								{data.falsePositive && (
									<p className="text-sm text-red-600">
										⚠️ False positive - environmental noise detected
									</p>
								)}
								{!data.falsePositive && (
									<p className="text-sm text-emerald-600">
										✓ Consensus validation prevented false alarm
									</p>
								)}
							</motion.div>
						</motion.div>
					</AnimatePresence>

					{/* Right: Explanation */}
					<motion.div
						className="flex flex-col justify-center space-y-6"
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<AnimatePresence mode="wait">
							{mode === "single" ? (
								<motion.div
									key="single-explanation"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="space-y-4"
								>
									<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
										<TrendingDown className="w-4 h-4 text-red-600" />
										<span className="text-xs font-mono text-red-700">Traditional Approach</span>
									</div>
									<h3 className="text-2xl font-bold text-slate-900">One Sensor = One Problem</h3>
									<p className="text-slate-600 leading-relaxed">
										When acoustic sensors alone detect vibrations, they can't distinguish between:
									</p>
									<ul className="space-y-3">
										<li className="flex items-start gap-3">
											<div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
											<span className="text-slate-700">Animal movement near tracks</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
											<span className="text-slate-700">
												Weather-related vibrations (wind, rain)
											</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
											<span className="text-slate-700">Actual sabotage attempts</span>
										</li>
									</ul>
									<p className="text-sm text-slate-500 pt-2 border-t border-slate-200">
										Result: 40% false positive rate that erodes operator trust
									</p>
								</motion.div>
							) : (
								<motion.div
									key="triple-explanation"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="space-y-4"
								>
									<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
										<ShieldCheck className="w-4 h-4 text-emerald-600" />
										<span className="text-xs font-mono text-emerald-700">Triple-Lock Logic</span>
									</div>
									<h3 className="text-2xl font-bold text-slate-900">Multi-Modal Verification</h3>
									<p className="text-slate-600 leading-relaxed">
										All three sensors must agree for an alert to trigger:
									</p>
									<ul className="space-y-3">
										<li className="flex items-start gap-3">
											<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
											<span className="text-slate-700">Acoustic detects vibration pattern</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
											<span className="text-slate-700">Thermal confirms human heat signature</span>
										</li>
										<li className="flex items-start gap-3">
											<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
											<span className="text-slate-700">LiDAR verifies track geometry change</span>
										</li>
									</ul>
									<p className="text-sm text-slate-500 pt-2 border-t border-slate-200">
										Result: 99.9% accuracy with near-zero false positives
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</div>
			</PageContainer>
		</Section>
	);
}

// Confidence Meter Component
function ConfidenceMeter({
	label,
	confidence,
	triggered,
	delay,
}: {
	label: string;
	confidence: number;
	triggered: boolean;
	delay: number;
}) {
	return (
		<motion.div
			className="space-y-2"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
		>
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-slate-700">{label}</span>
				<span className="text-xs font-mono text-slate-500">{confidence}%</span>
			</div>
			<div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
				<motion.div
					className={`absolute inset-y-0 left-0 rounded-full ${
						triggered
							? "bg-linear-to-r from-blue-500 to-purple-500"
							: "bg-linear-to-r from-slate-400 to-slate-500"
					}`}
					initial={{ width: 0 }}
					animate={{ width: `${confidence}%` }}
					transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
				/>
				{triggered && (
					<motion.div
						className="absolute inset-y-0 left-0 bg-white/20"
						initial={{ width: 0 }}
						animate={{ width: `${confidence}%` }}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				)}
			</div>
		</motion.div>
	);
}
