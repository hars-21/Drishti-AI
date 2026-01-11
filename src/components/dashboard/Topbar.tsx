import { useState, useEffect } from "react";
import { Menu, Bell, Wifi } from "lucide-react";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-20">
			<div className="flex items-center">
				<button
					onClick={onMenuClick}
					className="p-2 -ml-2 mr-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
				>
					<Menu className="w-6 h-6" />
				</button>

				<div className="hidden md:flex items-center text-sm font-medium text-slate-500">
					<span className="mr-3">System Status:</span>
					<div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
						OPERATIONAL
					</div>
				</div>
			</div>

			<div className="flex items-center space-x-4">
				{/* Kavach Indicator */}
				<div className="hidden md:flex items-center px-3 py-1.5 bg-slate-900 rounded-md text-white shadow-sm ring-1 ring-slate-900/5">
					<Wifi className="w-4 h-4 text-blue-400 mr-2" />
					<span className="text-xs font-bold tracking-wider">KAVACH 4.0 CONNECTED</span>
				</div>

				<div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

				{/* Time */}
				<div className="hidden md:block text-right">
					<div className="text-sm font-bold text-slate-900 leading-none">
						{time.toLocaleTimeString([], { hour12: false })}
					</div>
					<div className="text-xs text-slate-500 font-medium">{time.toLocaleDateString()}</div>
				</div>

				<button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
					<Bell className="w-5 h-5" />
					<span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
				</button>

				<div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
					<img
						src="https://api.dicebear.com/7.x/avataaars/svg?seed=Officer"
						alt="User"
						className="w-full h-full object-cover"
					/>
				</div>
			</div>
		</header>
	);
}
