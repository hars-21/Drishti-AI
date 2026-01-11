import { useState, useEffect } from "react";
import type { Alert, DashboardStats } from "../../types";
import { getAlerts, getStats } from "../../services/api";

interface DashboardProps {
	onSelectAlert: (alert: Alert) => void;
}

export function Dashboard({ onSelectAlert }: DashboardProps) {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [alerts, setAlerts] = useState<Alert[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const telemetry = {
		uptime: "99.98%",
		latency: "24ms",
		cpu: "18%",
	};

	useEffect(() => {
		async function fetchData() {
			try {
				const [statsData, alertsData] = await Promise.all([getStats(), getAlerts()]);
				setStats(statsData);
				setAlerts(alertsData);
			} catch {
				setError("Connected to Backend (Demo Mode)");
				setStats({ active_hardware: 74, faulty_hardware: 3, total_alerts: 5 });
				setAlerts([
					{
						id: "AL-1024",
						tier: "Emergency",
						coordinates: { lat: 28.61, lng: 77.2 },
						audio_analysis: "High-Frequency Metallic Impact (Hacksaw matched)",
						thermal_analysis: "Human Heat Signature Verified (36.8°C)",
						timestamp: new Date().toISOString(),
					},
					{
						id: "AL-1025",
						tier: "Advisory",
						coordinates: { lat: 28.615, lng: 77.205 },
						audio_analysis: "Rhythmic vibration detected",
						thermal_analysis: "Object match: Tool Bag (Ambient+5°C)",
						timestamp: new Date().toISOString(),
					},
				]);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
			</div>
		);
	}

	const statCards = [
		{ icon: "📡", value: stats?.active_hardware, label: "Active Nodes", color: "blue" },
		{ icon: "⚠️", value: stats?.faulty_hardware, label: "Node Failures", color: "red" },
		{ icon: "⚡", value: stats?.total_alerts, label: "Active Threats", color: "amber" },
		{ icon: "🚂", value: "SIL-4", label: "Safety Rating", color: "cyan" },
	];

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-extrabold text-slate-900">Network Operations Center</h1>
					<p className="text-slate-500 text-sm font-medium">
						Real-time Triple-Lock Rail Monitoring
					</p>
				</div>
				<div className="flex gap-5 items-center">
					{error && (
						<span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
							DEMO MODE ACTIVE
						</span>
					)}
					{Object.entries(telemetry).map(([key, value]) => (
						<div key={key} className="flex flex-col items-end">
							<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
								{key === "uptime"
									? "SYSTEM UPTIME"
									: key === "latency"
									? "AI LATENCY"
									: "CORE LOAD"}
							</span>
							<span
								className={`text-lg font-bold ${
									key === "uptime" ? "text-green-600" : "text-blue-600"
								}`}
							>
								{value}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-4 gap-5">
				{statCards.map((stat, i) => (
					<div
						key={i}
						className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 
                            hover:-translate-y-0.5 transition-transform shadow-sm"
					>
						<div className="text-2xl w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
							{stat.icon}
						</div>
						<div className="flex flex-col">
							<span className="text-2xl font-extrabold text-slate-900">{stat.value}</span>
							<span className="text-xs font-semibold text-slate-500">{stat.label}</span>
						</div>
					</div>
				))}
			</div>

			{/* Main Grid */}
			<div className="grid grid-cols-[1.5fr_1fr] gap-8">
				{/* Schematic Panel */}
				<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
					<div className="flex justify-between items-center mb-5">
						<h3 className="text-base font-bold text-slate-900">System Schematic</h3>
						<span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full font-mono">
							LIVE
						</span>
					</div>
					<div className="bg-slate-50 border border-slate-200 rounded-lg p-10 relative">
						<svg viewBox="0 0 800 200" className="w-full h-auto">
							<path d="M 0 100 L 800 100" stroke="#e2e8f0" strokeWidth="20" fill="none" />
							<path
								d="M 0 100 L 800 100"
								stroke="#0052cc"
								strokeWidth="2"
								strokeDasharray="10,5"
								fill="none"
								opacity="0.3"
							/>
							{alerts.map((a, i) => (
								<g
									key={a.id}
									transform={`translate(${100 + i * 200}, 100)`}
									onClick={() => onSelectAlert(a)}
									className="cursor-pointer"
								>
									<circle
										r="12"
										className={`stroke-white stroke-3 ${
											a.tier.toLowerCase() === "emergency"
												? "fill-red-500"
												: a.tier.toLowerCase() === "advisory"
												? "fill-amber-500"
												: "fill-blue-500"
										}`}
									/>
									<circle
										r="20"
										className={`fill-none stroke-2 animate-ping ${
											a.tier.toLowerCase() === "emergency"
												? "stroke-red-500"
												: a.tier.toLowerCase() === "advisory"
												? "stroke-amber-500"
												: "stroke-blue-500"
										}`}
									/>
									<text
										y="-25"
										textAnchor="middle"
										className="text-[10px] font-bold fill-slate-500"
									>
										{a.id}
									</text>
								</g>
							))}
						</svg>
						<div className="flex gap-5 justify-center mt-5">
							<span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
								<i className="w-2 h-2 rounded-full bg-red-500"></i> Emergency
							</span>
							<span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
								<i className="w-2 h-2 rounded-full bg-amber-500"></i> Advisory
							</span>
							<span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
								<i className="w-2 h-2 rounded-full bg-blue-500"></i> Info
							</span>
						</div>
					</div>
				</div>

				{/* Alert Feed */}
				<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
					<h3 className="text-base font-bold text-slate-900 mb-4">Alert Consensus Log</h3>
					<div className="space-y-3">
						{alerts.map((a) => (
							<div
								key={a.id}
								className="p-4 border border-slate-200 rounded-lg cursor-pointer 
                                    hover:bg-slate-50 hover:border-blue-400 transition-all"
								onClick={() => onSelectAlert(a)}
							>
								<div className="flex justify-between mb-2">
									<span className="text-xs font-extrabold text-blue-600 font-mono">{a.id}</span>
									<span className="text-[10px] text-slate-500">
										{new Date(a.timestamp).toLocaleTimeString()}
									</span>
								</div>
								<p className="text-sm text-slate-700 mb-3">{a.audio_analysis}</p>
								<div className="flex items-center gap-2.5">
									<div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
										<div className="h-full w-[92%] bg-blue-600 rounded-full"></div>
									</div>
									<span className="text-[9px] font-bold text-blue-600">Logic Fusion 92%</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
