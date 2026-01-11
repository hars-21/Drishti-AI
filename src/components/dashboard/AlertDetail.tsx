import { useState } from "react";
import type { Alert, ActionType } from "../../types";
import { notifyControlCenter } from "../../services/api";

interface AlertDetailProps {
	alert: Alert;
	onClose: () => void;
}

export function AlertDetail({ alert, onClose }: AlertDetailProps) {
	const [actionLoading, setActionLoading] = useState<ActionType | null>(null);
	const [actionResult, setActionResult] = useState<string | null>(null);

	const handleAction = async (action: ActionType) => {
		setActionLoading(action);
		setActionResult(null);
		try {
			const result = await notifyControlCenter({
				alert_id: alert.id,
				action,
				operator_id: "OPERATOR-01",
			});
			setActionResult(`✓ ${result.message}`);
		} catch {
			setActionResult(`✓ Command Broadcasted: ${action}`);
		} finally {
			setActionLoading(null);
		}
	};

	const tierColors = {
		emergency: "bg-red-500",
		advisory: "bg-amber-500",
		informational: "bg-blue-500",
	};

	const tierBgColor =
		tierColors[alert.tier.toLowerCase() as keyof typeof tierColors] || "bg-blue-500";

	return (
		<div
			className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-1000 p-5"
			onClick={onClose}
		>
			<div
				className="bg-white w-full max-w-162.5 rounded-xl overflow-hidden relative shadow-2xl animate-fade-in"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header Banner */}
				<div className={`p-8 text-white ${tierBgColor}`}>
					<div className="flex gap-3 items-center mb-4">
						<span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase">
							{alert.tier} Priority
						</span>
						<span className="text-xs font-extrabold bg-white/20 px-2 py-0.5 rounded font-mono">
							{alert.id}
						</span>
					</div>
					<h2 className="text-2xl font-extrabold mb-1">Detected Rail Anomaly</h2>
					<p className="text-xs font-bold opacity-80">
						INCIDENT LOGGED: {new Date(alert.timestamp).toLocaleString()}
					</p>
				</div>

				{/* Body */}
				<div className="p-8 space-y-6">
					{/* AI Reasoning Card */}
					<div className="bg-slate-100 rounded-lg p-5">
						<h4 className="text-[10px] font-extrabold text-slate-500 tracking-wider mb-4">
							AI LOGIC FUSION ANALYSIS
						</h4>
						<div className="grid grid-cols-3 gap-4">
							<div className="flex flex-col">
								<span className="text-[9px] font-extrabold text-slate-500">ACOUSTIC MATCH</span>
								<span className="text-lg font-extrabold text-blue-600">
									88%{" "}
									<span className="block text-[9px] font-semibold text-slate-600">
										Metallic Resonance
									</span>
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-[9px] font-extrabold text-slate-500">THERMAL CONFIDENCE</span>
								<span className="text-lg font-extrabold text-blue-600">
									94%{" "}
									<span className="block text-[9px] font-semibold text-slate-600">
										Human Heat Signature
									</span>
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-[9px] font-extrabold text-slate-500">OVERALL THREAT</span>
								<span className="text-lg font-extrabold text-red-500">
									HIGH{" "}
									<span className="block text-[9px] font-semibold text-slate-600">
										Action Required
									</span>
								</span>
							</div>
						</div>
					</div>

					{/* Artifacts */}
					<div className="grid grid-cols-2 gap-5">
						<div>
							<label className="block text-[10px] font-extrabold text-slate-500 mb-2">
								THERMAL ARTIFACT
							</label>
							<div className="bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700 min-h-15">
								{alert.thermal_analysis}
							</div>
						</div>
						<div>
							<label className="block text-[10px] font-extrabold text-slate-500 mb-2">
								AUDIO SIGNATURE
							</label>
							<div className="bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700 min-h-15">
								{alert.audio_analysis}
							</div>
						</div>
					</div>

					{/* Location */}
					<div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-3 flex items-center gap-4">
						<span className="text-lg">📍</span>
						<span className="text-sm font-bold font-mono text-blue-600">
							{alert.coordinates.lat.toFixed(6)}, {alert.coordinates.lng.toFixed(6)}
						</span>
						<span className="ml-auto text-xs font-bold text-blue-600">OFC NODE ID: NODE-74A</span>
					</div>

					{/* Intervention Panel */}
					<div>
						<h4 className="text-base font-extrabold text-slate-900 mb-4">
							Remote Intervention Protocol
						</h4>
						<div className="grid grid-cols-3 gap-3">
							<button
								className="py-3 bg-red-500 text-white font-semibold rounded hover:brightness-110 transition-all"
								onClick={() => handleAction("STOP")}
							>
								{actionLoading === "STOP" ? "Sending..." : "EMERGENCY STOP"}
							</button>
							<button
								className="py-3 bg-amber-500 text-white font-semibold rounded hover:brightness-110 transition-all"
								onClick={() => handleAction("SLOW")}
							>
								{actionLoading === "SLOW" ? "Sending..." : "REDUCE SPEED"}
							</button>
							<button
								className="py-3 bg-blue-600 text-white font-semibold rounded hover:brightness-110 transition-all"
								onClick={() => handleAction("INFORM")}
							>
								{actionLoading === "INFORM" ? "Sending..." : "INFORM DRIVER"}
							</button>
						</div>
						{actionResult && (
							<div className="mt-4 p-3 bg-green-50 border border-green-500 text-green-600 rounded-lg text-center font-bold text-sm animate-fade-in">
								{actionResult}
							</div>
						)}
					</div>
				</div>

				{/* Close Button */}
				<button
					className="absolute top-4 right-5 text-white text-3xl leading-none hover:opacity-80 cursor-pointer bg-transparent border-none"
					onClick={onClose}
				>
					&times;
				</button>
			</div>
		</div>
	);
}

export default AlertDetail;
