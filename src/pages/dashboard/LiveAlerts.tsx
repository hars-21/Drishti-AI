import { useState } from "react";
import { AlertsFeed } from "../../components/dashboard/AlertsFeed";
import { HardwareProximity } from "../../components/dashboard/HardwareProximity";
import { KavachActions } from "../../components/dashboard/KavachActions";
import type { Alert } from "../../services/api/types";

export default function LiveAlerts() {
	const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-2xl font-bold text-slate-900 tracking-tight">Live Alerts</h1>
				<p className="text-sm text-slate-500">Real-time incident monitoring and automated responses</p>
			</div>

			{/* Main Grid */}
			<div className="grid lg:grid-cols-3 gap-6">
				{/* Left: Alerts Feed */}
				<div className="lg:col-span-2 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
							Active Alerts
						</h2>
						<span className="text-[10px] text-slate-500 font-mono">Auto-refresh: 10s</span>
					</div>
					<AlertsFeed onAlertSelect={setSelectedAlert} />
				</div>

				{/* Right: Sidebar */}
				<div className="space-y-6">
					{/* Hardware Proximity */}
					<div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
						<HardwareProximity
							alertId={selectedAlert?.id}
							lat={selectedAlert?.coordinates.lat}
							lng={selectedAlert?.coordinates.lng}
						/>
					</div>

					{/* Kavach Actions */}
					{selectedAlert && (
						<div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
							<KavachActions
								alertId={selectedAlert.id}
								onActionComplete={() => {
									// Could refresh alerts or show feedback
								}}
							/>
						</div>
					)}

					{/* Placeholder when no alert selected */}
					{!selectedAlert && (
						<div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center">
							<p className="text-sm text-slate-500">
								Select an alert to view Kavach actions
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
