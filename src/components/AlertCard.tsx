import React from "react";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type AlertCardProps = {
	riskLevel: RiskLevel;
	intentScore: number;
	timestamp: string;
	reasons: string[];
};

const severityStyle: Record<RiskLevel, string> = {
	LOW: "border-emerald-200 bg-emerald-50 text-emerald-900",
	MEDIUM: "border-amber-200 bg-amber-50 text-amber-900",
	HIGH: "border-rose-200 bg-rose-50 text-rose-900",
};

const badgeStyle: Record<RiskLevel, string> = {
	LOW: "bg-emerald-100 text-emerald-900",
	MEDIUM: "bg-amber-100 text-amber-900",
	HIGH: "bg-rose-100 text-rose-900",
};

const AlertCard: React.FC<AlertCardProps> = ({ riskLevel, intentScore, timestamp, reasons }) => {
	return (
		<article
			className={`rounded-xl border shadow-sm ${severityStyle[riskLevel]} divide-y divide-white/40`}
			aria-live="polite"
		>
			<div className="flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-3">
					<span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle[riskLevel]}`}>
						{riskLevel}
					</span>
					<p className="text-sm font-medium">Intent Score</p>
				</div>
				<div className="text-2xl font-semibold tracking-tight">{intentScore}</div>
			</div>
			<div className="px-4 py-3 flex items-center justify-between text-sm">
				<span className="font-medium">Timestamp</span>
				<span className="text-slate-700">{timestamp}</span>
			</div>
			<div className="px-4 py-3 bg-white/60 text-slate-900">
				<p className="text-sm font-semibold mb-2">Reasons</p>
				<ul className="list-disc list-inside space-y-1 text-sm text-slate-800">
					{reasons.map((reason, idx) => (
						<li key={`${reason}-${idx}`}>{reason}</li>
					))}
				</ul>
			</div>
		</article>
	);
};

export default AlertCard;
