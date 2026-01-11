type ServiceState = "Online" | "Degraded" | "Offline";

const tone = {
	Online: "border-emerald-800 bg-emerald-900/30 text-emerald-100",
	Degraded: "border-amber-800 bg-amber-900/30 text-amber-100",
	Offline: "border-rose-800 bg-rose-900/30 text-rose-100",
};

const Summary = ({ label, value }: { label: string; value: string }) => (
	<div className="rounded-xl border border-slate-800 bg-[#0f1a2d] px-4 py-3">
		<p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
		<p className="text-xl font-semibold text-slate-50 mt-1">{value}</p>
	</div>
);

const StatusRow = ({
	name,
	state,
	detail,
}: {
	name: string;
	state: ServiceState;
	detail: string;
}) => (
	<div className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0b1324] px-4 py-3">
		<div>
			<p className="text-sm font-semibold text-slate-100">{name}</p>
			<p className="text-[11px] text-slate-400">{detail}</p>
		</div>
		<span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${tone[state]}`}>
			{state}
		</span>
	</div>
);

const SystemStatus = () => {
	const lastAlert = "2026-01-11 09:32 UTC";
	const services: { name: string; state: ServiceState; detail: string }[] = [
		{ name: "Inference API", state: "Online", detail: "Latency p95 118 ms" },
		{ name: "Camera Ingest", state: "Online", detail: "14 streams" },
		{ name: "DAS Collector", state: "Degraded", detail: "Span-3 recalibrating" },
		{ name: "Geometry Engine", state: "Online", detail: "Stereo pairs synced" },
		{ name: "Audit Log", state: "Online", detail: "Write-protected" },
		{ name: "Notifier", state: "Online", detail: "SMS · RailTel" },
	];

	return (
		<div className="min-h-screen bg-[#0b1220] text-slate-50">
			<header className="px-6 py-4 border-b border-slate-800 bg-[#0c182b]">
				<h1 className="text-lg font-semibold">Systems Overview</h1>
			</header>
			<main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<Summary label="Control Room" value="Eastern Zone" />
					<Summary label="Uptime (24h)" value="99.93%" />
					<Summary label="Last Alert" value={lastAlert} />
					<Summary label="Audit Trail" value="Enabled" />
				</div>
				<section className="rounded-xl border border-slate-800 bg-[#0f1a2d] p-5 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-sm font-semibold">Service Health</h2>
						<span className="text-[11px] text-slate-400">Automated · 60s polling</span>
					</div>
					<div className="grid gap-3 md:grid-cols-2">
						{services.map((service) => (
							<StatusRow key={service.name} {...service} />
						))}
					</div>
				</section>
			</main>
		</div>
	);
};

export default SystemStatus;
