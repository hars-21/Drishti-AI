import { CheckCircle2, AlertTriangle, PlayCircle, Video, Activity, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const timelineEvents = [
	{
		time: "10:42:01.200",
		source: "Acoustic Sensor (DAS)",
		event: "High-frequency vibration detected",
		detail: "Characteristic signature match: Hacksaw / Metal cutting",
		icon: Activity,
		status: "detected",
		color: "text-blue-600",
		border: "border-blue-600",
	},
	{
		time: "10:42:01.850",
		source: "Thermal Camera (IR)",
		event: "Heat signature confirmed",
		detail: "Human presence detected on track (98% confidence)",
		icon: Video,
		status: "verified",
		color: "text-purple-600",
		border: "border-purple-600",
	},
	{
		time: "10:42:02.100",
		source: "Geometry Sensor (LiDAR)",
		event: "Rail discontinuity detected",
		detail: "Gap > 5mm recorded at sector 4B",
		icon: AlertTriangle,
		status: "critical",
		color: "text-orange-600",
		border: "border-orange-600",
	},
	{
		time: "10:42:02.150",
		source: "Consensus Engine",
		event: "SABOTAGE CONFIRMED",
		detail: "Multi-modal agreement reached. Risk Level: CRITICAL",
		icon: CheckCircle2,
		status: "confirmed",
		color: "text-red-600",
		border: "border-red-600",
	},
	{
		time: "10:42:02.200",
		source: "Kavach 4.0",
		event: "EMERGENCY BRAKING TRIGGERED",
		detail: "Signal sent to Train #12951 (Rajdhani Express)",
		icon: Zap,
		status: "action",
		color: "text-green-600",
		border: "border-green-600",
		pulse: true,
	},
];

export default function IncidentDetails() {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 tracking-tight">
						Incident #2026-XJL-99
					</h1>
					<p className="text-slate-500">Sabotage Attempt - Sector 4B - Resolved</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">Download Report</Button>
					<Button variant="primary">Notify Authorities</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-8">
					<Card>
						<CardHeader>
							<CardTitle>Event Timeline (Millisecond Precision)</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="relative border-l-2 border-slate-200 ml-3 space-y-12 py-4">
								{timelineEvents.map((evt, idx) => (
									<div key={idx} className="relative pl-8">
										<div
											className={`absolute -left-2.25 top-1 w-4 h-4 rounded-full bg-white border-4 ${
												evt.border
											} ${evt.pulse ? "animate-ping" : ""}`}
										></div>
										<div
											className={`absolute -left-2.25 top-1 w-4 h-4 rounded-full bg-white border-4 ${evt.border}`}
										></div>

										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
											<span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
												{evt.time}
											</span>
											<Badge
												variant={
													evt.status === "action"
														? "error"
														: evt.status === "confirmed"
														? "error"
														: "neutral"
												}
											>
												{evt.source}
											</Badge>
										</div>
										<h3 className={`text-lg font-bold ${evt.color} flex items-center gap-2`}>
											<evt.icon className="w-5 h-5" />
											{evt.event}
										</h3>
										<p className="text-slate-600 mt-1">{evt.detail}</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Visual Verification</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="aspect-video bg-slate-900 rounded-lg relative overflow-hidden group">
								<div className="absolute inset-0 flex items-center justify-center">
									<PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform cursor-pointer" />
								</div>
								<div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
									IR Camera #402
								</div>
							</div>
							<p className="text-xs text-slate-500 mt-2 text-center">
								Video captured 2 seconds pre-trigger
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Active Responses</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
								<span className="font-medium text-red-800">Kavach Interlock</span>
								<Badge variant="error">ENGAGED</Badge>
							</div>
							<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
								<span className="font-medium text-blue-800">Local Police</span>
								<Badge variant="info">NOTIFIED</Badge>
							</div>
							<div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
								<span className="font-medium text-slate-700">Maintenance</span>
								<Badge variant="neutral">PENDING</Badge>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
