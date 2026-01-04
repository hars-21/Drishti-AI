import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

type NavItem = {
	label: string;
	path: string;
};

type Stat = {
	label: string;
	value: string;
	sub?: string;
};

type EventRow = {
	time: string;
	location: string;
	source: string;
	risk: "Informational" | "Advisory" | "Emergency";
	action: string;
};

type Alert = {
	time: string;
	location: string;
	layers: string[];
	risk: "Informational" | "Advisory" | "Emergency";
};

type Sensor = {
	id: string;
	type: string;
	status: "Online" | "Offline";
	heartbeat: string;
};

type DecisionItem = {
	stage: string;
	detail: string;
	status: string;
};

const navItems: NavItem[] = [
	{ label: "Overview", path: "/dashboard" },
	{ label: "Live Alerts", path: "/dashboard/alerts" },
	{ label: "Sensors", path: "/dashboard/sensors" },
	{ label: "Decision Log", path: "/dashboard/logs" },
	{ label: "System Health", path: "/dashboard/health" },
];

const statusPalette = {
	Operational: "bg-emerald-100 text-emerald-800 border border-emerald-200",
	Degraded: "bg-amber-100 text-amber-900 border border-amber-200",
	Emergency: "bg-rose-100 text-rose-900 border border-rose-200",
};

const StatusBadge = ({ label }: { label: keyof typeof statusPalette }) => (
	<span
		className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusPalette[label]}`}
	>
		<span className="h-2.5 w-2.5 rounded-full bg-current opacity-80" />
		{label}
	</span>
);

const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
	<aside
		className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 shadow-sm z-30 transform transition-transform duration-200 lg:translate-x-0 ${
			open ? "translate-x-0" : "-translate-x-full"
		}`}
	>
		<div className="h-16 flex items-center px-5 border-b border-slate-200">
			<span className="text-lg font-semibold tracking-tight text-slate-900">Drishti AI</span>
		</div>
		<nav className="py-4">
			{navItems.map((item) => (
				<SidebarLink key={item.path} to={item.path} label={item.label} onSelect={onClose} />
			))}
		</nav>
	</aside>
);

const SidebarLink = ({
	to,
	label,
	onSelect,
}: {
	to: string;
	label: string;
	onSelect: () => void;
}) => {
	const location = useLocation();
	const active =
		to === "/dashboard"
			? location.pathname === to
			: location.pathname === to || location.pathname.startsWith(`${to}`);
	return (
		<Link
			to={to}
			onClick={onSelect}
			className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
				active
					? "text-slate-900 bg-slate-100 border-l-4 border-slate-900"
					: "text-slate-600 hover:text-slate-900"
			}`}
		>
			<span className="text-base">{label}</span>
		</Link>
	);
};

const Header = ({ title, onToggleSidebar }: { title: string; onToggleSidebar: () => void }) => (
	<header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
		<div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
			<div className="flex items-center gap-3">
				<button
					onClick={onToggleSidebar}
					className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-md border border-slate-200 text-slate-700"
					aria-label="Toggle navigation"
				>
					<span className="sr-only">Toggle sidebar</span>☰
				</button>
				<h1 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h1>
			</div>
			<div className="flex items-center gap-3">
				<StatusBadge label="Operational" />
				<div className="h-10 w-10 rounded-full bg-slate-200" />
			</div>
		</div>
	</header>
);

const StatCard = ({ label, value, sub }: Stat) => (
	<div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
		<p className="text-sm text-slate-500">{label}</p>
		<div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
		{sub ? <p className="mt-1 text-sm text-slate-500">{sub}</p> : null}
	</div>
);

const TableRow = ({ row }: { row: EventRow }) => (
	<tr className="even:bg-slate-50">
		<td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">{row.time}</td>
		<td className="px-4 py-3 text-sm text-slate-700">{row.location}</td>
		<td className="px-4 py-3 text-sm text-slate-700">{row.source}</td>
		<td className="px-4 py-3">
			<span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeTone(row.risk)}`}>
				{row.risk}
			</span>
		</td>
		<td className="px-4 py-3 text-sm text-slate-700">{row.action}</td>
	</tr>
);

const badgeTone = (risk: "Informational" | "Advisory" | "Emergency") => {
	if (risk === "Emergency") return "bg-rose-100 text-rose-900";
	if (risk === "Advisory") return "bg-amber-100 text-amber-900";
	return "bg-blue-100 text-blue-900";
};

const OverviewPage = () => {
	const stats: Stat[] = [
		{ label: "Active Alerts", value: "07", sub: "Last 30 min" },
		{ label: "Trains Monitored", value: "142", sub: "Corridor KGP - HWH" },
		{ label: "Sensors Online", value: "286 / 294", sub: "DAS / IR / LiDAR" },
		{ label: "Avg Response Time", value: "42 ms", sub: "Edge to Kavach" },
	];

	const riskTiers = [
		{ label: "Informational", value: 18, tone: "bg-blue-50 text-blue-900" },
		{ label: "Advisory", value: 6, tone: "bg-amber-50 text-amber-900" },
		{ label: "Emergency", value: 1, tone: "bg-rose-50 text-rose-900" },
	];

	const events: EventRow[] = [
		{
			time: "08:44:12",
			location: "PKR-12.4N",
			source: "Acoustic",
			risk: "Advisory",
			action: "Operator review",
		},
		{
			time: "08:40:03",
			location: "SNP-08.1E",
			source: "Thermal",
			risk: "Informational",
			action: "Logged",
		},
		{
			time: "08:33:55",
			location: "KVD-04.9S",
			source: "Geometry",
			risk: "Emergency",
			action: "Kavach dispatch",
		},
		{
			time: "08:29:17",
			location: "BDR-21.0W",
			source: "Acoustic",
			risk: "Informational",
			action: "Trend analysis",
		},
	];

	return (
		<div className="space-y-8">
			<section>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat) => (
						<StatCard key={stat.label} label={stat.label} value={stat.value} sub={stat.sub} />
					))}
				</div>
			</section>
			<section className="grid gap-4 sm:grid-cols-3">
				{riskTiers.map((tier) => (
					<div
						key={tier.label}
						className={`rounded-xl border border-slate-200 p-4 shadow-sm ${tier.tone}`}
					>
						<div className="text-sm font-medium text-slate-700">{tier.label}</div>
						<div className="text-2xl font-semibold mt-1">{tier.value}</div>
					</div>
				))}
			</section>
			<section className="rounded-xl border border-slate-200 bg-white shadow-sm">
				<div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between">
					<h3 className="text-base font-semibold text-slate-900">Recent Events</h3>
					<span className="text-sm text-slate-500">Last 60 minutes</span>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full text-left">
						<thead className="text-xs uppercase text-slate-500">
							<tr>
								<th className="px-4 py-3">Time</th>
								<th className="px-4 py-3">Location</th>
								<th className="px-4 py-3">Trigger Source</th>
								<th className="px-4 py-3">Risk</th>
								<th className="px-4 py-3">Action Taken</th>
							</tr>
						</thead>
						<tbody>
							{events.map((row) => (
								<TableRow key={`${row.time}-${row.location}`} row={row} />
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
};

export const AlertsPage = () => {
	const alerts: Alert[] = [
		{ time: "08:44", location: "PKR-12.4N", layers: ["Acoustic", "Thermal"], risk: "Advisory" },
		{ time: "08:33", location: "KVD-04.9S", layers: ["Geometry", "Thermal"], risk: "Emergency" },
		{ time: "08:26", location: "BDR-21.0W", layers: ["Acoustic"], risk: "Informational" },
	];

	return (
		<div className="space-y-4">
			{alerts.map((alert) => (
				<div
					key={`${alert.time}-${alert.location}`}
					className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
				>
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
							{alert.time}
						</div>
						<div>
							<p className="text-sm font-semibold text-slate-900">{alert.location}</p>
							<div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-600">
								{alert.layers.map((layer) => (
									<span key={layer} className="px-2 py-1 rounded-full bg-slate-100">
										{layer}
									</span>
								))}
							</div>
						</div>
					</div>
					<span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeTone(alert.risk)}`}>
						{alert.risk}
					</span>
				</div>
			))}
		</div>
	);
};

export const SensorsPage = () => {
	const sensors: Sensor[] = [
		{ id: "DAS-014", type: "DAS", status: "Online", heartbeat: "08:45:02" },
		{ id: "IR-207", type: "IR", status: "Online", heartbeat: "08:44:51" },
		{ id: "LID-031", type: "LiDAR", status: "Offline", heartbeat: "08:40:10" },
		{ id: "IR-209", type: "IR", status: "Online", heartbeat: "08:45:05" },
		{ id: "DAS-017", type: "DAS", status: "Online", heartbeat: "08:44:58" },
		{ id: "LID-042", type: "LiDAR", status: "Online", heartbeat: "08:44:46" },
	];

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{sensors.map((sensor) => (
				<div key={sensor.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
					<div className="flex items-center justify-between">
						<p className="text-sm font-semibold text-slate-900">{sensor.id}</p>
						<span className="text-xs text-slate-500">{sensor.type}</span>
					</div>
					<div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
						<span
							className={`h-2.5 w-2.5 rounded-full ${
								sensor.status === "Online" ? "bg-emerald-500" : "bg-slate-400"
							}`}
						/>
						{sensor.status}
					</div>
					<p className="mt-2 text-xs text-slate-500">Last heartbeat: {sensor.heartbeat}</p>
				</div>
			))}
		</div>
	);
};

export const LogsPage = () => {
	const decisions: DecisionItem[] = [
		{ stage: "Detection", detail: "DAS spike localized to PKR-12.4N", status: "Acoustic" },
		{ stage: "Verification", detail: "Thermal human signature confirmed", status: "Thermal" },
		{
			stage: "Decision",
			detail: "Consensus achieved; advisory escalated",
			status: "Consensus Achieved",
		},
	];

	return (
		<div className="space-y-4">
			{decisions.map((item, idx) => (
				<div key={item.stage} className="flex gap-3">
					<div className="flex flex-col items-center">
						<div className="h-3 w-3 rounded-full bg-slate-900" />
						{idx < decisions.length - 1 ? <div className="h-full w-px bg-slate-200" /> : null}
					</div>
					<div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
						<div className="flex items-center justify-between">
							<p className="text-sm font-semibold text-slate-900">{item.stage}</p>
							<span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
								{item.status}
							</span>
						</div>
						<p className="mt-2 text-sm text-slate-700">{item.detail}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export const HealthPage = () => {
	const checklist = [
		{ label: "Kavach Link", state: "Connected" },
		{ label: "Fiber DAS", state: "Active" },
		{ label: "AI Models", state: "Loaded" },
		{ label: "Network Latency", state: "Normal" },
	];

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{checklist.map((item) => (
				<div
					key={item.label}
					className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between"
				>
					<div>
						<p className="text-sm font-semibold text-slate-900">{item.label}</p>
						<p className="text-xs text-slate-500">Status</p>
					</div>
					<span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
						{item.state}
					</span>
				</div>
			))}
		</div>
	);
};

const DashboardLayout = () => {
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = React.useState(false);
	const pageTitle = navItems.reduce(
		(current, item) => {
			const matches =
				location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
			return matches && item.path.length > current.path.length
				? { path: item.path, label: item.label }
				: current;
		},
		{ path: "", label: "Dashboard" }
	).label;

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900">
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="lg:pl-64">
				<Header title={pageTitle} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
				<main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
					<Outlet />
				</main>
			</div>
			{sidebarOpen ? (
				<button
					type="button"
					onClick={() => setSidebarOpen(false)}
					className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
					aria-label="Close sidebar overlay"
				/>
			) : null}
		</div>
	);
};

export default DashboardLayout;
export { OverviewPage };
