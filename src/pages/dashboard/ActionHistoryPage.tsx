import { useState, useEffect } from "react";
import type { ActionLog } from "../../types";
import { getActionHistory } from "../../services/api";

const mockHistory: ActionLog[] = [
	{
		id: 1,
		alert_id: "AL-1",
		action: "STOP",
		timestamp: new Date(Date.now() - 120000).toISOString(),
	},
	{
		id: 2,
		alert_id: "AL-2",
		action: "SLOW",
		timestamp: new Date(Date.now() - 60000).toISOString(),
	},
	{ id: 3, alert_id: "AL-1", action: "INFORM", timestamp: new Date().toISOString() },
];

export function ActionHistoryPage() {
	const [history, setHistory] = useState<ActionLog[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchHistory() {
			try {
				const data = await getActionHistory();
				setHistory(data.length > 0 ? data : mockHistory);
			} catch {
				setHistory(mockHistory);
			} finally {
				setLoading(false);
			}
		}
		fetchHistory();
	}, []);

	const getActionBadge = (action: string) => {
		const styles = {
			STOP: "bg-red-50 text-red-600",
			SLOW: "bg-amber-50 text-amber-600",
			INFORM: "bg-blue-50 text-blue-600",
		};
		return (
			<span
				className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
					styles[action as keyof typeof styles] || "bg-slate-50 text-slate-600"
				}`}
			>
				{action}
			</span>
		);
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 h-72">
				<div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
				<p className="text-slate-500">Loading action history...</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h2 className="text-2xl font-extrabold text-slate-900">Action History</h2>
				<p className="text-slate-500 text-sm">
					Log of all control center notifications sent to trains
				</p>
			</div>

			{/* Table */}
			<div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
				<table className="w-full">
					<thead>
						<tr className="bg-slate-50 border-b border-slate-200">
							<th className="text-left px-5 py-4 text-[11px] font-extrabold text-slate-500 uppercase">
								ID
							</th>
							<th className="text-left px-5 py-4 text-[11px] font-extrabold text-slate-500 uppercase">
								Alert
							</th>
							<th className="text-left px-5 py-4 text-[11px] font-extrabold text-slate-500 uppercase">
								Action Taken
							</th>
							<th className="text-left px-5 py-4 text-[11px] font-extrabold text-slate-500 uppercase">
								Timestamp
							</th>
						</tr>
					</thead>
					<tbody className="font-mono">
						{history.length === 0 ? (
							<tr>
								<td colSpan={4} className="px-5 py-8 text-center text-slate-500">
									No actions have been taken yet.
								</td>
							</tr>
						) : (
							history.map((entry) => (
								<tr
									key={entry.id}
									className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
								>
									<td className="px-5 py-4 text-sm text-slate-500">#{entry.id}</td>
									<td className="px-5 py-4 text-sm text-slate-900">{entry.alert_id}</td>
									<td className="px-5 py-4">{getActionBadge(entry.action)}</td>
									<td className="px-5 py-4 text-sm text-slate-500">
										{new Date(entry.timestamp).toLocaleString()}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Info Card */}
			<div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center gap-5">
				<div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="w-7 h-7 text-blue-600"
					>
						<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
						<path d="M12 8v4M12 16h.01" />
					</svg>
				</div>
				<div>
					<p className="text-base font-bold text-blue-600 mb-1">Kavach Integration</p>
					<p className="text-sm text-slate-600 leading-relaxed">
						All STOP/SLOW commands logged here are transmitted via secure MQTT to the Loco-Kavach
						unit on the corresponding train, triggering SIL-4 compliant safety procedures.
					</p>
				</div>
			</div>
		</div>
	);
}

export default ActionHistoryPage;
