import { useState, useEffect } from "react";
import { Menu, ShieldCheck, Clock, Activity, AlertTriangle, Cpu } from "lucide-react";
import { getStats } from "../../services/api";
import type { SystemStats } from "../../services/api/types";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
	const [time, setTime] = useState(new Date());
	const [stats, setStats] = useState<SystemStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Update time every second
	useEffect(() => {
		const timer = setInterval(() => setTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	// Fetch stats with 30s auto-refresh
	useEffect(() => {
		async function fetchStats() {
			try {
				const data = await getStats();
				setStats(data);
			} catch {
				// Silently fail - will show skeleton
			} finally {
				setIsLoading(false);
			}
		}

		fetchStats();
		const interval = setInterval(fetchStats, 30000);
		return () => clearInterval(interval);
	}, []);

	return (
		<header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm">
			{/* Left: Menu Button */}
			<div className="flex items-center gap-4">
				<button
					onClick={onMenuClick}
					className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
				>
					<Menu className="w-5 h-5" />
				</button>

				{/* System Health */}
				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200">
					<div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
					<span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
						Operational
					</span>
				</div>

				{/* Stats from API */}
				<div className="hidden md:flex items-center gap-3">
					{/* Active Hardware */}
					<StatBadge
						icon={<Cpu className="w-3 h-3" />}
						label="Active"
						value={stats?.activeHardware}
						isLoading={isLoading}
						variant="blue"
					/>

					{/* Faulty Hardware */}
					<StatBadge
						icon={<Activity className="w-3 h-3" />}
						label="Faulty"
						value={stats?.faultyHardware}
						isLoading={isLoading}
						variant={stats?.faultyHardware && stats.faultyHardware > 0 ? "amber" : "slate"}
					/>

					{/* Total Alerts */}
					<StatBadge
						icon={<AlertTriangle className="w-3 h-3" />}
						label="Alerts"
						value={stats?.totalAlerts}
						isLoading={isLoading}
						variant={stats?.totalAlerts && stats.totalAlerts > 0 ? "red" : "slate"}
					/>
				</div>
			</div>

			{/* Right: Kavach + Time */}
			<div className="flex items-center gap-4">
				{/* Kavach Link Status */}
				<div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200">
					<ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
					<span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold">
						Kavach linked
					</span>
				</div>

				{/* Divider */}
				<div className="hidden md:block h-4 w-px bg-slate-300"></div>

				{/* Time */}
				<div className="flex items-center gap-2">
					<Clock className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
					<div className="text-right">
						<div className="text-xs font-mono text-slate-600 tabular-nums">
							{time.toLocaleTimeString([], { hour12: false })}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

// Stat Badge Component
function StatBadge({
	icon,
	label,
	value,
	isLoading,
	variant = "slate",
}: {
	icon: React.ReactNode;
	label: string;
	value?: number;
	isLoading: boolean;
	variant: "blue" | "amber" | "red" | "slate";
}) {
	const variants = {
		blue: "bg-blue-50 border-blue-200 text-blue-700",
		amber: "bg-amber-50 border-amber-200 text-amber-700",
		red: "bg-red-50 border-red-200 text-red-700",
		slate: "bg-slate-50 border-slate-200 text-slate-600",
	};

	return (
		<div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${variants[variant]}`}>
			{icon}
			{isLoading ? (
				<div className="w-8 h-3 bg-slate-200 rounded animate-pulse" />
			) : (
				<span className="text-[10px] font-mono uppercase tracking-wider font-bold">
					{value ?? "-"} {label}
				</span>
			)}
		</div>
	);
}
