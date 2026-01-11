import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { ShieldCheck, AlertTriangle, TrainFront, ShieldOff } from "lucide-react";

// Mock data
const temporalData = [
	{ time: "00:00", threats: 0 },
	{ time: "02:00", threats: 0 },
	{ time: "04:00", threats: 1 },
	{ time: "06:00", threats: 0 },
	{ time: "08:00", threats: 2 },
	{ time: "10:00", threats: 1 },
	{ time: "12:00", threats: 0 },
	{ time: "14:00", threats: 0 },
	{ time: "16:00", threats: 1 },
	{ time: "18:00", threats: 0 },
	{ time: "20:00", threats: 0 },
	{ time: "22:00", threats: 0 },
	{ time: "23:59", threats: 0 },
];

const signalData = [
	{ name: "Acoustic", confidence: 87, color: "bg-blue-500" },
	{ name: "Thermal", confidence: 94, color: "bg-purple-500" },
	{ name: "Geometry", confidence: 98, color: "bg-emerald-500" },
];

export default function Overview() {
	const [systemConfidence, setSystemConfidence] = useState(0);

	useEffect(() => {
		// Animate confidence meter on load
		const timer = setTimeout(() => setSystemConfidence(99.2), 300);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h1>
				<p className="text-sm text-slate-500 font-mono">Sector 4 • Mumbai-Pune Corridor</p>
			</div>

			{/* 1. System Confidence Band */}
			<motion.section
				className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50/30 border border-slate-200 p-8 shadow-sm"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					{/* Left: Confidence Meter */}
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-4">
							<ShieldCheck className="w-6 h-6 text-emerald-500" />
							<h2 className="text-lg font-bold text-slate-900">System Confidence</h2>
						</div>

						{/* Radial Progress */}
						<div className="flex items-center gap-8">
							<div className="relative w-32 h-32">
								<svg className="transform -rotate-90 w-32 h-32">
									<circle
										cx="64"
										cy="64"
										r="56"
										stroke="currentColor"
										strokeWidth="8"
										fill="none"
										className="text-slate-200"
									/>
									<motion.circle
										cx="64"
										cy="64"
										r="56"
										stroke="url(#gradient)"
										strokeWidth="8"
										fill="none"
										strokeLinecap="round"
										initial={{ strokeDashoffset: 352 }}
										animate={{ strokeDashoffset: 352 - (352 * systemConfidence) / 100 }}
										transition={{ duration: 1.5, ease: "easeOut" }}
										strokeDasharray="352"
									/>
									<defs>
										<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
											<stop offset="0%" stopColor="#10b981" />
											<stop offset="100%" stopColor="#06b6d4" />
										</linearGradient>
									</defs>
								</svg>
								<div className="absolute inset-0 flex flex-col items-center justify-center">
									<div className="text-3xl font-black text-slate-900 tabular-nums">
										{systemConfidence.toFixed(1)}
									</div>
									<div className="text-[10px] text-slate-500 uppercase tracking-wider">%</div>
								</div>
							</div>

							<div>
								<p className="text-base text-slate-700 leading-relaxed max-w-md">
									All systems operating within safe thresholds.
									<br />
									<span className="text-sm text-emerald-600">
										No active threats detected.
									</span>
								</p>
							</div>
						</div>
					</div>

					{/* Right: Consensus Indicator */}
					<div className="px-6 py-4 rounded-xl bg-white border border-slate-200 shadow-sm">
						<div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
							Consensus Status
						</div>
						<div className="text-2xl font-black text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text">
							NOMINAL
						</div>
					</div>
				</div>
			</motion.section>

			{/* 2. Risk Snapshot */}
			<motion.section
				className="grid grid-cols-2 lg:grid-cols-4 gap-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<StatCard
					icon={AlertTriangle}
					label="Active Threats"
					value="0"
					sublabel="Last 24h"
					color="amber"
				/>
				<StatCard
					icon={TrainFront}
					label="Trains Monitored"
					value="42"
					sublabel="Real-time"
					color="blue"
				/>
				<StatCard
					icon={ShieldOff}
					label="False Stops Prevented"
					value="18"
					sublabel="This week"
					color="emerald"
				/>
				<StatCard
					icon={ShieldCheck}
					label="Emergency Actions"
					value="0"
					sublabel="Today"
					color="purple"
				/>
			</motion.section>

			{/* 3. Signal Agreement Visualization */}
			<motion.section
				className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
			>
				<h2 className="text-base font-bold text-slate-900 mb-6">Signal Agreement</h2>

				<div className="space-y-4">
					{signalData.map((signal, index) => (
						<div key={signal.name}>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-slate-700">{signal.name}</span>
								<span className="text-xs font-mono text-slate-500 tabular-nums">
									{signal.confidence}%
								</span>
							</div>
							<div className="h-2 bg-slate-100 rounded-full overflow-hidden">
								<motion.div
									className={`h-full ${signal.color}`}
									initial={{ width: 0 }}
									animate={{ width: `${signal.confidence}%` }}
									transition={{ duration: 1, delay: 0.4 + index * 0.1, ease: "easeOut" }}
								/>
							</div>
						</div>
					))}

					{/* Consensus Bar */}
					<div className="pt-4 mt-4 border-t border-slate-200">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-bold text-slate-900 flex items-center gap-2">
								<ShieldCheck className="w-4 h-4 text-emerald-500" />
								Consensus Score
							</span>
							<span className="text-sm font-mono text-emerald-600 font-bold tabular-nums">
								{systemConfidence.toFixed(1)}%
							</span>
						</div>
						<div className="h-3 bg-slate-100 rounded-full overflow-hidden">
							<motion.div
								className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
								initial={{ width: 0 }}
								animate={{ width: `${systemConfidence}%` }}
								transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
							/>
						</div>
					</div>
				</div>
			</motion.section>

			{/* 4. Temporal Intelligence */}
			<motion.section
				className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
			>
				<div className="flex items-start justify-between mb-6">
					<div>
						<h2 className="text-base font-bold text-slate-900 mb-1">Threat Pattern Analysis</h2>
						<p className="text-xs text-slate-500">24-hour window</p>
					</div>

					{/* Insight Annotation */}
					<div className="px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200">
						<p className="text-xs text-amber-700 font-medium">
							Peak risk: 04:00–10:00
						</p>
					</div>
				</div>

				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={temporalData}>
							<defs>
								<linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
									<stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
							<XAxis
								dataKey="time"
								stroke="#94a3b8"
								fontSize={11}
								tickLine={false}
								axisLine={false}
								fontFamily="monospace"
							/>
							<YAxis
								stroke="#94a3b8"
								fontSize={11}
								tickLine={false}
								axisLine={false}
								fontFamily="monospace"
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "#ffffff",
									border: "1px solid #e2e8f0",
									borderRadius: "8px",
									fontSize: "12px",
									fontFamily: "monospace",
								}}
								labelStyle={{ color: "#475569" }}
							/>
							<Area
								type="monotone"
								dataKey="threats"
								stroke="#f59e0b"
								strokeWidth={2}
								fillOpacity={1}
								fill="url(#threatGradient)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</motion.section>
		</div>
	);
}

// Stat Card Component
function StatCard({
	icon: Icon,
	label,
	value,
	sublabel,
	color,
}: {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	label: string;
	value: string;
	sublabel: string;
	color: "amber" | "blue" | "emerald" | "purple";
}) {
	const colorClasses = {
		amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
		blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
		emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
		purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
	};

	return (
		<div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
			<div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-3`}>
				<Icon className="w-4 h-4" />
			</div>
			<div className="text-2xl font-black text-slate-900 tabular-nums mb-1">{value}</div>
			<div className="text-xs font-medium text-slate-600 mb-0.5">{label}</div>
			<div className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">
				{sublabel}
			</div>
		</div>
	);
}
