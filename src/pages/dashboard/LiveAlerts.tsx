import { AlertCircle, AlertTriangle, ShieldAlert } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

const alerts = [
	{
		id: 1,
		time: "10:42:15 AM",
		location: "Sector 4B (Km 124.5)",
		signals: ["Acoustic", "Thermal"],
		risk: "Critical",
		action: "Kavach Triggered (Auto-Brake)",
		status: "Resolved",
		icon: ShieldAlert,
		color: "text-red-600",
		bg: "bg-red-50",
	},
	{
		id: 2,
		time: "09:15:22 AM",
		location: "Sector 2A (Km 88.2)",
		signals: ["Visual"],
		risk: "Medium",
		action: "Slowing Down (Caution)",
		status: "Monitoring",
		icon: AlertTriangle,
		color: "text-amber-600",
		bg: "bg-amber-50",
	},
	{
		id: 3,
		time: "08:30:05 AM",
		location: "Sector 1C (Km 42.1)",
		signals: ["Acoustic"],
		risk: "Low",
		action: "Logged (Noise Filtered)",
		status: "False Positive",
		icon: AlertCircle,
		color: "text-blue-600",
		bg: "bg-blue-50",
	},
	{
		id: 4,
		time: "06:12:44 AM",
		location: "Sector 5A (Km 156.8)",
		signals: ["Thermal", "Visual"],
		risk: "High",
		action: "Driver Alerted",
		status: "Investigating",
		icon: AlertTriangle,
		color: "text-orange-600",
		bg: "bg-orange-50",
	},
];

export default function LiveAlerts() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-slate-900 tracking-tight">Live Alerts</h1>
				<p className="text-slate-500">Real-time incident log and automated responses.</p>
			</div>

			<Card>
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead className="bg-slate-50 border-b border-slate-200">
							<tr>
								<th className="px-6 py-4 font-semibold text-slate-700">Severity</th>
								<th className="px-6 py-4 font-semibold text-slate-700">Time</th>
								<th className="px-6 py-4 font-semibold text-slate-700">Location</th>
								<th className="px-6 py-4 font-semibold text-slate-700">Signals</th>
								<th className="px-6 py-4 font-semibold text-slate-700">System Action</th>
								<th className="px-6 py-4 font-semibold text-slate-700">Status</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{alerts.map((alert) => (
								<tr
									key={alert.id}
									className={`hover:bg-slate-50 transition-colors ${
										alert.risk === "Critical" ? "bg-red-50/30" : ""
									}`}
								>
									<td className="px-6 py-4">
										<div className="flex items-center space-x-3">
											<div className={`p-2 rounded-lg ${alert.bg} ${alert.color}`}>
												<alert.icon className="w-5 h-5" />
											</div>
											<span className={`font-bold ${alert.color}`}>{alert.risk}</span>
										</div>
									</td>
									<td className="px-6 py-4 font-mono text-slate-600">{alert.time}</td>
									<td className="px-6 py-4 text-slate-900 font-medium">{alert.location}</td>
									<td className="px-6 py-4">
										<div className="flex gap-2">
											{alert.signals.map((s) => (
												<Badge
													key={s}
													variant="neutral"
													className="bg-white border border-slate-200"
												>
													{s}
												</Badge>
											))}
										</div>
									</td>
									<td className="px-6 py-4">
										{alert.action.includes("Kavach") ? (
											<Badge variant="error" className="animate-pulse">
												{alert.action}
											</Badge>
										) : (
											<span className="text-slate-600">{alert.action}</span>
										)}
									</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												alert.status === "Resolved"
													? "success"
													: alert.status === "Investigating"
													? "warning"
													: "neutral"
											}
										>
											{alert.status}
										</Badge>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}
