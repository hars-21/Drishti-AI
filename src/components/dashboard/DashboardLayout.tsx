import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { Alert } from "../../types";
import { AlertDetail } from "./AlertDetail";

type Page = "dashboard" | "hardware" | "history";

export function DashboardLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

	const getCurrentPage = (): Page => {
		if (location.pathname.includes("hardware")) return "hardware";
		if (location.pathname.includes("history")) return "history";
		return "dashboard";
	};

	const handleNavigation = (page: Page) => {
		switch (page) {
			case "dashboard":
				navigate("/dashboard");
				break;
			case "hardware":
				navigate("/dashboard/hardware");
				break;
			case "history":
				navigate("/dashboard/history");
				break;
		}
	};

	const handleSelectAlert = (alert: Alert) => {
		setSelectedAlert(alert);
	};

	const handleCloseAlert = () => {
		setSelectedAlert(null);
	};

	const navItems = [
		{
			id: "dashboard" as Page,
			label: "Dashboard",
			icon: (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="w-5 h-5"
				>
					<rect x="3" y="3" width="7" height="9" />
					<rect x="14" y="3" width="7" height="5" />
					<rect x="14" y="12" width="7" height="9" />
					<rect x="3" y="16" width="7" height="5" />
				</svg>
			),
		},
		{
			id: "hardware" as Page,
			label: "Hardware Health",
			icon: (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="w-5 h-5"
				>
					<rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
					<rect x="9" y="9" width="6" height="6" />
					<line x1="9" y1="1" x2="9" y2="4" />
					<line x1="15" y1="1" x2="15" y2="4" />
					<line x1="9" y1="20" x2="9" y2="23" />
					<line x1="15" y1="20" x2="15" y2="23" />
				</svg>
			),
		},
		{
			id: "history" as Page,
			label: "Action History",
			icon: (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="w-5 h-5"
				>
					<circle cx="12" cy="12" r="10" />
					<polyline points="12 6 12 12 16 14" />
				</svg>
			),
		},
	];

	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Sidebar */}
			<aside className="w-70 h-screen fixed bg-white border-r border-slate-200 p-6 flex flex-col z-50 shadow-sm">
				{/* Logo */}
				<div className="flex items-center gap-3 mb-10 px-2">
					<div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="w-5 h-5"
						>
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
							<path d="M12 8v4M12 16h.01" />
						</svg>
					</div>
					<div className="flex flex-col">
						<span className="text-lg font-extrabold text-blue-600 tracking-tight">DRISHTI AI</span>
						<span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
							Triple-Lock Rail Safety
						</span>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex flex-col gap-2 flex-1">
					{navItems.map((item) => (
						<button
							key={item.id}
							onClick={() => handleNavigation(item.id)}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all w-full text-left
                                ${
																	getCurrentPage() === item.id
																		? "bg-blue-50 text-blue-600"
																		: "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
																}`}
						>
							{item.icon}
							{item.label}
						</button>
					))}
				</nav>

				{/* Footer */}
				<div className="pt-5 border-t border-slate-200 mt-auto">
					<div className="flex items-center gap-2.5 text-sm font-semibold text-slate-600">
						<div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_5px] shadow-green-500"></div>
						System Online
					</div>
					<div className="text-xs text-slate-500 mt-1">v1.0.0 • SIL-4 Compliant</div>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 ml-70 p-10 max-w-350">
				<Outlet context={{ onSelectAlert: handleSelectAlert }} />
			</main>

			{/* Alert Detail Modal */}
			{selectedAlert && <AlertDetail alert={selectedAlert} onClose={handleCloseAlert} />}
		</div>
	);
}

export default DashboardLayout;
