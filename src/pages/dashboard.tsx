import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import AlertCard from "../components/AlertCard";
import IntentGauge from "../components/IntentGauge";
import LiveStream from "../components/LiveStream";

type Status = "Nominal" | "Degraded" | "Tampering" | "Review" | "Cleared";

const navItems = [
	{ label: "Command", badge: "LIVE" },
	{ label: "Alerts", badge: "3" },
	{ label: "Systems", badge: "OK" },
	{ label: "Reports", badge: "" },
];

const opsMetrics = [
	{
		label: "Corridors Under Watch",
		value: "12",
		detail: "Eastern, South-Eastern",
		tone: "text-emerald-300",
	},
	{ label: "Active Alerts", value: "03", detail: "2 advisory / 1 review", tone: "text-amber-300" },
	{ label: "Median Response", value: "42s", detail: "Last 60 mins", tone: "text-sky-200" },
	{ label: "Kavach Link", value: "Nominal", detail: "Encrypted · SIL-4", tone: "text-emerald-300" },
];

const alertQueue: { id: string; status: Status; note: string; corridor: string }[] = [
	{
		id: "KGP-YD-21",
		status: "Tampering",
		note: "Thermal signature matched with acoustic spike",
		corridor: "Kharagpur Yard",
	},
	{
		id: "HWH-OC-04",
		status: "Review",
		note: "Single-source vibration; awaiting second modality",
		corridor: "Howrah Outer",
	},
	{
		id: "BWN-PL-12",
		status: "Cleared",
		note: "Maintenance crew verified on site",
		corridor: "Bardhaman Loop",
	},
];

const systemChecks: { name: string; state: Status; detail: string }[] = [
	{ name: "Acoustic DAS", state: "Nominal", detail: "Fiber span 41 km" },
	{ name: "Thermal Layer", state: "Nominal", detail: "12 cameras synced" },
	{ name: "Geometry Layer", state: "Degraded", detail: "Stereo pair 3 recalibrating" },
	{ name: "Backhaul", state: "Nominal", detail: "Redundant MPLS" },
	{ name: "Storage", state: "Nominal", detail: "14-day retention" },
	{ name: "Audit Trail", state: "Nominal", detail: "Immutable" },
];

const threatTrend = [
	{ time: "07:00", tampering: 2, advisories: 5 },
	{ time: "07:30", tampering: 3, advisories: 4 },
	{ time: "08:00", tampering: 4, advisories: 6 },
	{ time: "08:30", tampering: 2, advisories: 5 },
	{ time: "09:00", tampering: 3, advisories: 3 },
	{ time: "09:30", tampering: 5, advisories: 4 },
];

const corridorLoad = [
	{ name: "KGP – HWH", trains: 18, alerts: 3 },
	{ name: "BWN – ASN", trains: 11, alerts: 1 },
	{ name: "KGP – BHC", trains: 9, alerts: 2 },
	{ name: "HWH – KPD", trains: 7, alerts: 0 },
];

const responseLog = [
	{ time: "09:38", action: "RPF patrol dispatched", ref: "KGP-YD-21" },
	{ time: "09:35", action: "Thermal sweep requested", ref: "HWH-OC-04" },
	{ time: "09:30", action: "Kavach link check complete", ref: "SYSTEM" },
	{ time: "09:24", action: "Maintenance crew verified", ref: "BWN-PL-12" },
];

const StatusPill = ({ state }: { state: Status }) => {
	const palette: Record<string, string> = {
		Nominal: "bg-emerald-900/40 text-emerald-100 border border-emerald-800",
		Degraded: "bg-amber-900/30 text-amber-100 border border-amber-800",
		Tampering: "bg-rose-900/30 text-rose-100 border border-rose-800",
		Review: "bg-sky-900/30 text-sky-100 border border-sky-800",
		Cleared: "bg-slate-800 text-slate-100 border border-slate-700",
	};
	return (
		<span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${palette[state]}`}>
			{state}
		</span>
	);
};

const SummaryCard = ({
	label,
	value,
	detail,
	tone,
}: {
	label: string;
	value: string;
	detail: string;
	tone: string;
}) => (
	<div className="rounded-xl border border-slate-800 bg-[#0f1a2d] px-4 py-3 shadow-lg shadow-black/20">
		<p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
		<div className={`text-2xl font-semibold mt-1 ${tone}`}>{value}</div>
		<p className="text-xs text-slate-400 mt-1">{detail}</p>
	</div>
);

const SectionTitle = ({ title, meta }: { title: string; meta?: string }) => (
	<div className="flex items-center justify-between">
		<h2 className="text-sm font-semibold text-slate-100 tracking-tight">{title}</h2>
		{meta ? <span className="text-[11px] text-slate-400">{meta}</span> : null}
	</div>
);

const DashboardPage = () => (
	<div className="min-h-screen bg-[#0b1220] text-slate-50">
		<header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-[#0c182b]">
			<div className="flex items-center gap-3">
				<div className="w-9 h-9 rounded border border-slate-700 bg-slate-900/60 flex items-center justify-center text-xs font-semibold text-slate-100">
					DA
				</div>
				<div>
					<p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
						Railway Safety Command
					</p>
					<p className="text-lg font-semibold">Drishti AI</p>
				</div>
			</div>
			<div className="flex items-center gap-6 text-sm text-slate-200">
				<div className="flex flex-col items-end">
					<span className="font-semibold">Eastern Zone</span>
					<span className="text-xs text-slate-400">KGP · HWH · BWN</span>
				</div>
				<div className="h-8 w-px bg-slate-800" />
				<div className="flex flex-col items-end">
					<span className="font-semibold">UTC 09:40</span>
					<span className="text-xs text-emerald-300">Audit Trail Enabled</span>
				</div>
			</div>
		</header>
		<div className="flex">
			<aside className="hidden lg:block w-60 bg-[#0d1524] border-r border-slate-800 min-h-[calc(100vh-4rem)]">
				<nav className="py-4 space-y-1">
					{navItems.map((item) => (
						<div
							key={item.label}
							className="flex items-center justify-between px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800/50 transition-colors"
						>
							<span>{item.label}</span>
							{item.badge ? (
								<span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
									{item.badge}
								</span>
							) : null}
						</div>
					))}
				</nav>
				<div className="border-t border-slate-800 px-5 py-4 text-[11px] text-slate-400 space-y-2">
					<p className="font-semibold text-slate-200">Compliance</p>
					<p>Audit logging active</p>
					<p>TLS 1.3 · HSTS</p>
				</div>
			</aside>
			<main className="flex-1 p-6 space-y-6">
				<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{opsMetrics.map((metric) => (
						<SummaryCard key={metric.label} {...metric} />
					))}
				</section>

				<section className="grid gap-6 xl:grid-cols-3">
					<div className="xl:col-span-2 rounded-xl border border-slate-800 bg-[#0f1a2d] shadow-lg shadow-black/20">
						<div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
							<h2 className="text-sm font-semibold text-slate-100">Live CCTV Feed</h2>
							<span className="text-[11px] text-slate-400">Channel 04 · Corridor KGP</span>
						</div>
						<div className="p-4">
							<LiveStream src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="CCTV · KGP Yard" />
						</div>
					</div>
					<div className="rounded-xl border border-slate-800 bg-[#0f1a2d] shadow-lg shadow-black/20 p-5 flex flex-col gap-4">
						<IntentGauge value={72} />
						<div className="text-xs text-slate-300 space-y-1">
							<p className="font-semibold text-slate-100">Tampering Risk · Live</p>
							<p>Consensus weighted: Acoustic 0.42 · Thermal 0.38 · Geometry 0.20</p>
						</div>
					</div>
				</section>

				<section className="grid gap-6 lg:grid-cols-2">
					<div className="rounded-xl border border-slate-800 bg-[#0f1a2d] shadow-lg shadow-black/20 p-5 space-y-4">
						<SectionTitle title="Threat & Advisory Trend" meta="Last 3 hours" />
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={threatTrend}>
									<CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" />
									<XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} />
									<YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} allowDecimals={false} />
									<Tooltip
										contentStyle={{
											background: "#0f172a",
											border: "1px solid #1e293b",
											color: "#e2e8f0",
										}}
									/>
									<Legend wrapperStyle={{ color: "#e2e8f0" }} />
									<Line
										type="monotone"
										dataKey="tampering"
										stroke="#f43f5e"
										strokeWidth={2}
										dot={false}
										name="Tampering"
									/>
									<Line
										type="monotone"
										dataKey="advisories"
										stroke="#38bdf8"
										strokeWidth={2}
										dot={false}
										name="Advisories"
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
					<div className="rounded-xl border border-slate-800 bg-[#0f1a2d] shadow-lg shadow-black/20 p-5 space-y-4">
						<SectionTitle title="Corridor Load" meta="Trains vs Alerts" />
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={corridorLoad}>
									<CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="3 3" />
									<XAxis
										dataKey="name"
										stroke="#94a3b8"
										tick={{ fontSize: 11 }}
										angle={-10}
										height={50}
									/>
									<YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} allowDecimals={false} />
									<Tooltip
										contentStyle={{
											background: "#0f172a",
											border: "1px solid #1e293b",
											color: "#e2e8f0",
										}}
									/>
									<Legend wrapperStyle={{ color: "#e2e8f0" }} />
									<Bar dataKey="trains" name="Trains" fill="#38bdf8" radius={[3, 3, 0, 0]} />
									<Bar dataKey="alerts" name="Alerts" fill="#f43f5e" radius={[3, 3, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</section>

				<section className="grid gap-6 xl:grid-cols-3">
					<div className="rounded-xl border border-slate-800 bg-[#0f1a2d] shadow-lg shadow-black/20 p-5 space-y-4">
						<SectionTitle title="Alert Queue" meta="Sorted by severity" />
						<div className="space-y-3">
							{alertQueue.map((alert) => (
								<div
									key={alert.id}
									className="rounded-lg border border-slate-800 bg-[#0b1324] px-3 py-3 flex items-center justify-between"
								>
									<div>
										<p className="text-sm font-semibold text-slate-100">{alert.id}</p>
										<p className="text-xs text-slate-400">{alert.corridor}</p>
										<p className="text-[11px] text-slate-400 mt-1">{alert.note}</p>
									</div>
									<StatusPill state={alert.status} />
								</div>
							))}
						</div>
					</div>
					<div className="xl:col-span-2 rounded-xl border border-slate-800 bg-[#0f1a2d] shadow-lg shadow-black/20 p-5 space-y-4">
						<SectionTitle title="System Health" meta="Automated polling · 60s" />
						<div className="grid gap-3 md:grid-cols-2">
							{systemChecks.map((check) => (
								<div
									key={check.name}
									className="rounded-lg border border-slate-800 bg-[#0b1324] px-3 py-3 flex items-center justify-between"
								>
									<div>
										<p className="text-sm font-semibold text-slate-100">{check.name}</p>
										<p className="text-[11px] text-slate-400">{check.detail}</p>
									</div>
									<StatusPill state={check.state} />
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="grid gap-6 lg:grid-cols-3">
					<div className="rounded-xl border border-slate-800 bg-[#0f1a2d] shadow-lg shadow-black/20 p-5 space-y-4">
						<SectionTitle title="High Priority Alerts" meta="Ready for dispatch" />
						<div className="grid gap-3">
							<AlertCard
								riskLevel="HIGH"
								intentScore={92}
								timestamp="09:38 UTC"
								reasons={[
									"Thermal mass detected at km 211",
									"DAS frequency match to hammering",
									"Geometry layer reports ballast disturbance",
								]}
							/>
							<AlertCard
								riskLevel="MEDIUM"
								intentScore={71}
								timestamp="09:35 UTC"
								reasons={["Single acoustic spike", "Awaiting thermal corroboration"]}
							/>
						</div>
					</div>
					<div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0f1a2d] shadow-lg shadow-black/20 p-5 space-y-4">
						<SectionTitle title="Response Log" meta="Operator actions" />
						<ul className="space-y-2 text-sm text-slate-200">
							{responseLog.map((entry) => (
								<li
									key={entry.ref}
									className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0b1324] px-3 py-2"
								>
									<div>
										<p className="font-semibold text-slate-100">{entry.action}</p>
										<p className="text-[11px] text-slate-400">Ref: {entry.ref}</p>
									</div>
									<span className="text-[11px] text-slate-400">{entry.time}</span>
								</li>
							))}
						</ul>
					</div>
				</section>
			</main>
		</div>
	</div>
);

export default DashboardPage;
