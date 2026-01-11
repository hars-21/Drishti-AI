import { Activity, Wifi, Thermometer, Box } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

const sensors = [
	{
		name: "Fiber Optic DAS Layer",
		status: "Online",
		uptime: "99.99%",
		latency: "12ms",
		health: 98,
		icon: Activity,
		color: "text-blue-600",
	},
	{
		name: "Thermal Camera Network",
		status: "Online",
		uptime: "99.95%",
		latency: "45ms",
		health: 92,
		icon: Thermometer,
		color: "text-purple-600",
	},
	{
		name: "LiDAR Geometry System",
		status: "Maintenance",
		uptime: "98.50%",
		latency: "22ms",
		health: 75,
		icon: Box,
		color: "text-orange-600",
	},
];

export default function SensorHealth() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sensor Health</h1>
				<p className="text-slate-500">Diagnostic status of multi-modal subsystems.</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{sensors.map((sensor, idx) => (
					<Card
						key={idx}
						className={sensor.status === "Maintenance" ? "border-orange-200 bg-orange-50/20" : ""}
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-base font-medium">{sensor.name}</CardTitle>
							<sensor.icon className={`h-4 w-4 text-muted-foreground ${sensor.color}`} />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{sensor.health}%</div>
							<p className="text-xs text-muted-foreground">Operational Health Score</p>

							<div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-slate-500">Status</span>
									<span
										className={`font-medium ${
											sensor.status === "Online" ? "text-green-600" : "text-orange-600"
										}`}
									>
										{sensor.status}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-slate-500">Uptime</span>
									<span className="font-medium">{sensor.uptime}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-slate-500">Latency</span>
									<span className="font-medium">{sensor.latency}</span>
								</div>
							</div>

							<div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
								<div
									className={`h-full rounded-full ${
										sensor.health > 90
											? "bg-green-500"
											: sensor.health > 70
											? "bg-orange-500"
											: "bg-red-500"
									}`}
									style={{ width: `${sensor.health}%` }}
								></div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Network Topology</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-300">
						<div className="text-center text-slate-400">
							<Wifi className="w-12 h-12 mx-auto mb-2 opacity-50" />
							<p>Network Map Visualization Placeholder</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
