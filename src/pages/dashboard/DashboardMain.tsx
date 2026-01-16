import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Radio, Thermometer, Activity, Shield, Zap } from "lucide-react";
import type { DashboardStats } from "../../types";
import { getStats } from "../../services/api";
import { useSimulation } from "../../context/SimulationContext";
import { SENSOR_NODES } from "../../types/mapTypes";

export function Dashboard() {
	const { alerts: simAlerts, detections, anomalies, acknowledgeAlert } = useSimulation();
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const statsData = await getStats();
				setStats(statsData);
			} catch {
				setStats({
					active_hardware: SENSOR_NODES.filter((s) => s.status === "active").length,
					faulty_hardware: SENSOR_NODES.filter((s) => s.status !== "active").length,
					total_alerts: simAlerts.length || 2,
				});
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [simAlerts.length]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
			</div>
		);
	}

	const unackedSimAlerts = simAlerts.filter((a) => !a.acknowledged);

	return (
		<div className="space-y-6 animate-fade-in">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-extrabold text-slate-900">Network Operations Center</h1>
					<p className="text-slate-500 text-sm font-medium">
						Real-time Triple-Lock Rail Monitoring
					</p>
				</div>
				<div className="flex gap-4 items-center">
					{unackedSimAlerts.length > 0 && (
						<span className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 rounded-full animate-pulse flex items-center gap-1">
							<AlertTriangle className="w-3 h-3" />
							{unackedSimAlerts.length} SIMULATION ALERT{unackedSimAlerts.length > 1 ? "S" : ""}
						</span>
					)}
					<div className="flex items-center gap-2 text-green-600">
						<Shield className="w-4 h-4" />
						<span className="text-sm font-bold">SIL-4</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-4 gap-4">
				<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
					<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
						<Radio className="w-5 h-5 text-blue-600" />
					</div>
					<div>
						<div className="text-xl font-extrabold text-slate-900">
							{stats?.active_hardware || 0}
						</div>
						<div className="text-xs font-medium text-slate-500">Active Sensors</div>
					</div>
				</div>
				<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
					<div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
						<AlertTriangle className="w-5 h-5 text-red-600" />
					</div>
					<div>
						<div className="text-xl font-extrabold text-slate-900">
							{stats?.faulty_hardware || 0}
						</div>
						<div className="text-xs font-medium text-slate-500">Node Failures</div>
					</div>
				</div>
				<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
					<div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
						<Zap className="w-5 h-5 text-amber-600" />
					</div>
					<div>
						<div className="text-xl font-extrabold text-slate-900">
							{anomalies.length || stats?.total_alerts || 0}
						</div>
						<div className="text-xs font-medium text-slate-500">Active Anomalies</div>
					</div>
				</div>
				<div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
					<div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
						<Activity className="w-5 h-5 text-purple-600" />
					</div>
					<div>
						<div className="text-xl font-extrabold text-slate-900">{detections.length}</div>
						<div className="text-xs font-medium text-slate-500">Detections</div>
					</div>
				</div>
			</div>

			{unackedSimAlerts.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-red-50 border border-red-200 rounded-xl p-4"
				>
					<div className="flex items-center gap-2 mb-3">
						<AlertTriangle className="w-5 h-5 text-red-600" />
						<h3 className="font-bold text-red-900">Simulation Alerts</h3>
					</div>
					<div className="grid gap-2">
						<AnimatePresence>
							{unackedSimAlerts.slice(0, 5).map((alert) => (
								<motion.div
									key={alert.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									className={`p-3 bg-white rounded-lg border-l-4 flex items-center justify-between ${
										alert.severity === "CRITICAL"
											? "border-red-500"
											: alert.severity === "WARNING"
											? "border-amber-500"
											: "border-blue-500"
									}`}
								>
									<div className="flex items-center gap-3">
										{alert.sensorType === "OFC_NODE" ? (
											<Radio className="w-4 h-4 text-purple-600" />
										) : (
											<Thermometer className="w-4 h-4 text-orange-600" />
										)}
										<div>
											<div className="text-sm font-semibold text-slate-800">{alert.message}</div>
											<div className="text-[10px] text-slate-500">
												{alert.sensorId} • {new Date(alert.timestamp).toLocaleTimeString()}
											</div>
										</div>
									</div>
									<button
										onClick={() => acknowledgeAlert(alert.id)}
										className="px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded"
									>
										ACK
									</button>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				</motion.div>
			)}

			<div className="grid grid-cols-[1.5fr_1fr] gap-6">
				<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-base font-bold text-slate-900">System Schematic</h3>
						<span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
							LIVE
						</span>
					</div>
					<div className="bg-slate-50 border border-slate-200 rounded-lg p-8 relative">
						<svg viewBox="0 0 800 200" className="w-full h-auto">
							<path d="M 0 100 L 800 100" stroke="#e2e8f0" strokeWidth="20" fill="none" />
							<path
								d="M 0 100 L 800 100"
								stroke="#1e40af"
								strokeWidth="2"
								strokeDasharray="10,5"
								fill="none"
								opacity="0.3"
							/>
							{detections.slice(0, 4).map((d, i) => (
								<g key={d.id} transform={`translate(${100 + i * 180}, 100)`}>
									<circle
										r="14"
										className={`stroke-white stroke-3 ${
											d.riskScore > 0.8
												? "fill-red-500"
												: d.riskScore > 0.6
												? "fill-amber-500"
												: "fill-blue-500"
										}`}
									/>
									<circle
										r="22"
										className={`fill-none stroke-2 animate-ping ${
											d.riskScore > 0.8
												? "stroke-red-500"
												: d.riskScore > 0.6
												? "stroke-amber-500"
												: "stroke-blue-500"
										}`}
									/>
									<text
										y="-28"
										textAnchor="middle"
										className="text-[10px] font-bold fill-slate-600"
									>
										{d.sensorId}
									</text>
								</g>
							))}
							{anomalies.slice(0, 3).map((a, i) => (
								<g key={a.id} transform={`translate(${200 + i * 200}, 100)`}>
									<polygon points="0,-20 8,0 -8,0" className="fill-red-500" />
								</g>
							))}
						</svg>
						<div className="flex gap-5 justify-center mt-4">
							<span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
								<i className="w-2 h-2 rounded-full bg-red-500"></i>Critical
							</span>
							<span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
								<i className="w-2 h-2 rounded-full bg-amber-500"></i>Warning
							</span>
							<span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
								<i className="w-2 h-2 rounded-full bg-blue-500"></i>Info
							</span>
						</div>
					</div>
				</div>

				<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
					<h3 className="text-base font-bold text-slate-900 mb-4">Detection Log</h3>
					<div className="space-y-2 max-h-75 overflow-y-auto">
						{detections.length === 0 ? (
							<div className="text-center py-8 text-sm text-slate-400">
								No detections - Run a simulation to generate alerts
							</div>
						) : (
							detections.map((d) => (
								<div
									key={d.id}
									className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
								>
									<div className="flex justify-between mb-1">
										<span className="text-xs font-bold text-blue-600 font-mono">{d.sensorId}</span>
										<span className="text-[10px] text-slate-500">
											{new Date(d.timestamp).toLocaleTimeString()}
										</span>
									</div>
									<p className="text-sm text-slate-700 mb-2">{d.analysis}</p>
									<div className="flex items-center gap-2">
										<div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
											<div
												className={`h-full rounded-full ${
													d.riskScore > 0.8
														? "bg-red-500"
														: d.riskScore > 0.6
														? "bg-amber-500"
														: "bg-blue-500"
												}`}
												style={{ width: `${d.riskScore * 100}%` }}
											></div>
										</div>
										<span
											className={`text-[10px] font-bold ${
												d.riskScore > 0.8
													? "text-red-600"
													: d.riskScore > 0.6
													? "text-amber-600"
													: "text-blue-600"
											}`}
										>
											{(d.riskScore * 100).toFixed(0)}%
										</span>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
