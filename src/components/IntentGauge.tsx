import React from "react";

type IntentGaugeProps = {
	value: number; // 0 - 100
};

const toneForValue = (value: number) => {
	if (value < 40) return { stroke: "#10b981", bg: "#ecfdf3", text: "text-emerald-700" };
	if (value <= 70) return { stroke: "#f59e0b", bg: "#fffbeb", text: "text-amber-700" };
	return { stroke: "#ef4444", bg: "#fef2f2", text: "text-rose-700" };
};

const IntentGauge: React.FC<IntentGaugeProps> = ({ value }) => {
	const clamped = Math.min(100, Math.max(0, value));
	const radius = 54;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (clamped / 100) * circumference;
	const tone = toneForValue(clamped);

	return (
		<div
			className={`w-48 h-48 rounded-2xl border border-slate-200 shadow-sm bg-white p-4 flex flex-col items-center justify-center gap-2`}
		>
			<p className="text-xs uppercase tracking-wide text-slate-500">Tampering Risk Score</p>
			<div className="relative w-32 h-32">
				<svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
					<circle cx="60" cy="60" r={radius} stroke="#e5e7eb" strokeWidth="12" fill="none" />
					<circle
						cx="60"
						cy="60"
						r={radius}
						stroke={tone.stroke}
						strokeWidth="12"
						strokeLinecap="round"
						fill="none"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className={`text-3xl font-semibold ${tone.text}`}>{clamped}</span>
					<span className="text-xs text-slate-500">/ 100</span>
				</div>
			</div>
		</div>
	);
};

export default IntentGauge;
