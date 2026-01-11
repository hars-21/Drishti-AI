import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	AreaChart,
	Area,
} from "recharts";
import { Activity, ShieldAlert, TrainFront, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

const kpiData = [
	{
		label: "Active Trains Monitored",
		value: "42",
		change: "+12%",
		icon: TrainFront,
		color: "text-blue-600",
		bg: "bg-blue-50",
	},
	{
		label: "Alerts Today",
		value: "3",
		change: "-50%",
		icon: ShieldAlert,
		color: "text-amber-600",
		bg: "bg-amber-50",
	},
	{
		label: "Kavach Triggers",
		value: "0",
		change: "Stable",
		icon: Zap,
		color: "text-green-600",
		bg: "bg-green-50",
	},
	{
		label: "System Confidence",
		value: "99.9%",
		change: "+0.1%",
		icon: Activity,
		color: "text-purple-600",
		bg: "bg-purple-50",
	},
];

const alertData = [
	{ name: "00:00", alerts: 0, confidence: 98 },
	{ name: "04:00", alerts: 0, confidence: 99 },
	{ name: "08:00", alerts: 2, confidence: 97 },
	{ name: "12:00", alerts: 1, confidence: 99 },
	{ name: "16:00", alerts: 0, confidence: 100 },
	{ name: "20:00", alerts: 0, confidence: 99 },
	{ name: "23:59", alerts: 0, confidence: 99 },
];

const consensusData = [
	{ name: "Acoustic", value: 85 },
	{ name: "Thermal", value: 92 },
	{ name: "LiDAR", value: 98 },
	{ name: "Fusion", value: 99.9 },
];

export default function Overview() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
				<p className="text-slate-500">Real-time monitoring across Sector 4 (Mumbai-Pune)</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{kpiData.map((kpi, index) => (
					<Card key={index}>
						<CardContent className="flex items-center p-6">
							<div className={`p-4 rounded-xl ${kpi.bg} mr-4`}>
								<kpi.icon className={`w-8 h-8 ${kpi.color}`} />
							</div>
							<div>
								<p className="text-sm font-medium text-slate-500">{kpi.label}</p>
								<div className="flex items-baseline space-x-2">
									<h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
									<span
										className={`text-xs font-semibold ${
											kpi.change.includes("+")
												? "text-green-600"
												: kpi.change.includes("-")
												? "text-green-600"
												: "text-slate-400"
										}`}
									>
										{kpi.change}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<Card className="p-6">
					<CardHeader className="px-0 pt-0">
						<CardTitle>Alert Frequency (24h)</CardTitle>
					</CardHeader>
					<div className="h-75 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={alertData}>
								<defs>
									<linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
										<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
								<XAxis
									dataKey="name"
									stroke="#64748b"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
								<Tooltip
									contentStyle={{
										borderRadius: "8px",
										border: "none",
										boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
									}}
								/>
								<Area
									type="monotone"
									dataKey="alerts"
									stroke="#3b82f6"
									fillOpacity={1}
									fill="url(#colorAlerts)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</Card>

				<Card className="p-6">
					<CardHeader className="px-0 pt-0">
						<CardTitle>Sensor Confidence Levels</CardTitle>
					</CardHeader>
					<div className="h-75 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={consensusData} layout="vertical">
								<CartesianGrid
									strokeDasharray="3 3"
									horizontal={true}
									vertical={false}
									stroke="#e2e8f0"
								/>
								<XAxis
									type="number"
									domain={[0, 100]}
									stroke="#64748b"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									dataKey="name"
									type="category"
									stroke="#64748b"
									fontSize={12}
									tickLine={false}
									axisLine={false}
									width={80}
								/>
								<Tooltip
									cursor={{ fill: "#f1f5f9" }}
									contentStyle={{
										borderRadius: "8px",
										border: "none",
										boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
									}}
								/>
								<Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={32} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</div>
		</div>
	);
}
