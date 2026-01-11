import { NavLink } from "react-router-dom";
import { LayoutDashboard, AlertTriangle, FileText, Activity, Cpu, LogOut, X } from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
	{ icon: LayoutDashboard, label: "OVERVIEW", to: "/dashboard/overview", code: "SYS-01" },
	{ icon: AlertTriangle, label: "LIVE ALERTS", to: "/dashboard/alerts", code: "ALRT-02" },
	{ icon: FileText, label: "INCIDENTS", to: "/dashboard/incidents", code: "RP-03" },
	{ icon: Activity, label: "SENSOR HEALTH", to: "/dashboard/health", code: "DIAG-04" },
	{ icon: Cpu, label: "SIMULATION", to: "/dashboard/simulation", code: "SIM-05" },
];

interface SidebarProps {
	isOpen: boolean;
	toggle: () => void;
}

export function Sidebar({ isOpen, toggle }: SidebarProps) {
	return (
		<>
			{/* Mobile overlay */}
			<div
				className={cn(
					"fixed inset-0 z-20 bg-slate-950/80 lg:hidden transition-opacity backdrop-blur-sm",
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				)}
				onClick={toggle}
			/>

			<aside
				className={cn(
					"fixed lg:relative z-30 flex flex-col bg-slate-950 text-slate-400 border-r border-slate-800/50 transition-all duration-300 ease-in-out font-mono",
					isOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
				)}
			>
				<div className="h-14 flex items-center justify-between px-4 border-b border-slate-800/50 bg-slate-950">
					<div className="flex items-center space-x-3 overflow-hidden">
						<div className="w-6 h-6 bg-blue-700 rounded-sm flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/50">
							<div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
						</div>
						{isOpen && (
							<div className="flex flex-col">
								<span className="font-bold text-slate-100 text-sm tracking-wider">DRISHTI-AI</span>
								<span className="text-[10px] text-blue-500 uppercase tracking-widest">
									Sentinels
								</span>
							</div>
						)}
					</div>
					<button onClick={toggle} className="lg:hidden text-slate-500 hover:text-white">
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
					{isOpen && (
						<div className="px-3 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
							Main Modules
						</div>
					)}

					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								cn(
									"flex items-center px-3 py-2 rounded-md transition-all group relative border border-transparent",
									isActive
										? "bg-blue-900/20 text-blue-400 border-blue-800/50 shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)]"
										: "hover:bg-slate-900 hover:text-slate-200 hover:border-slate-800"
								)
							}
						>
							<item.icon className={cn("w-4 h-4 shrink-0", !isOpen && "mx-auto")} />

							{isOpen && (
								<div className="ml-3 flex-1 flex items-baseline justify-between overflow-hidden">
									<span className="text-xs font-bold tracking-wide truncate">{item.label}</span>
									<span className="text-[9px] text-slate-600 font-normal ml-2">{item.code}</span>
								</div>
							)}

							{!isOpen && (
								<div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
									{item.label} <span className="text-slate-500 text-[10px] ml-1">{item.code}</span>
								</div>
							)}
						</NavLink>
					))}
				</div>

				<div className="p-2 border-t border-slate-800/50 bg-slate-950">
					<div
						className={cn(
							"flex items-center p-2 rounded-md bg-slate-900/50 border border-slate-800/50",
							!isOpen && "justify-center p-1"
						)}
					>
						<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
						{isOpen && (
							<span className="ml-3 text-[10px] uppercase font-bold text-emerald-500 tracking-wider">
								System Online
							</span>
						)}
					</div>

					<button
						className={cn(
							"flex items-center w-full mt-2 px-3 py-2 text-slate-500 hover:text-red-400 hover:bg-slate-900/50 rounded-md transition-colors",
							!isOpen && "justify-center px-0"
						)}
					>
						<LogOut className="w-4 h-4 shrink-0" />
						{isOpen && <span className="ml-3 text-xs font-medium">Disconnect</span>}
					</button>
				</div>
			</aside>
		</>
	);
}
