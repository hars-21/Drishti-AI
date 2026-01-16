import { useState } from "react";
import type { Hardware, HardwareStatus } from "../../types";
import { searchHardware } from "../../services/api";
import { MapPin } from "lucide-react";

const mockHardware: Hardware[] = [
	{ id: "HW-001", type: "OFC_NODE", coordinates: { lat: 28.61, lng: 77.2 }, status: "active" },
	{ id: "HW-002", type: "THERMAL_CAM", coordinates: { lat: 28.61, lng: 77.2 }, status: "active" },
	{ id: "HW-003", type: "OFC_NODE", coordinates: { lat: 28.615, lng: 77.205 }, status: "faulty" },
	{
		id: "HW-004",
		type: "LIDAR",
		coordinates: { lat: 28.62, lng: 77.21 },
		status: "config_failure",
	},
	{
		id: "HW-005",
		type: "THERMAL_CAM",
		coordinates: { lat: 28.625, lng: 77.215 },
		status: "active",
	},
];

export function HardwareHealth() {
	const [lat, setLat] = useState("28.6100");
	const [lng, setLng] = useState("77.2000");
	const [radius, setRadius] = useState("5.0");
	const [statusFilter, setStatusFilter] = useState<HardwareStatus | "all">("all");
	const [hardware, setHardware] = useState<Hardware[]>(mockHardware);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);

	const handleSearch = async () => {
		setLoading(true);
		try {
			const results = await searchHardware(parseFloat(lat), parseFloat(lng), parseFloat(radius));
			setHardware(results.length > 0 ? results : mockHardware);
		} catch {
			setHardware(mockHardware);
		} finally {
			setLoading(false);
			setSearched(true);
		}
	};

	const filteredHardware = hardware.filter(
		(hw) => statusFilter === "all" || hw.status === statusFilter
	);

	const getStatusBadge = (status: HardwareStatus) => {
		const styles = {
			active: "bg-green-50 text-green-600",
			faulty: "bg-red-50 text-red-600",
			config_failure: "bg-amber-50 text-amber-700",
		};
		const labels = { active: "Active", faulty: "Faulty", config_failure: "Config Failure" };
		return (
			<span className={`px-2 py-0.5 rounded-full text-xs font-bold ${styles[status]}`}>
				{labels[status]}
			</span>
		);
	};

	const getTypeIcon = (type: string) => {
		const icons = {
			OFC_NODE: (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="w-6 h-6"
				>
					<path d="M12 2L2 7l10 5 10-5-10-5z" />
					<path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
				</svg>
			),
			THERMAL_CAM: (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="w-6 h-6"
				>
					<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
					<circle cx="12" cy="13" r="4" />
				</svg>
			),
			LIDAR: (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="w-6 h-6"
				>
					<circle cx="12" cy="12" r="10" />
					<circle cx="12" cy="12" r="6" />
					<circle cx="12" cy="12" r="2" />
				</svg>
			),
		};
		return icons[type as keyof typeof icons] || null;
	};

	const borderColors = {
		active: "border-l-green-500",
		faulty: "border-l-red-500",
		config_failure: "border-l-amber-500",
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h2 className="text-2xl font-extrabold text-slate-900">Hardware Health</h2>
				<p className="text-slate-500 text-sm">
					Monitor and search sensor network by GPS coordinates
				</p>
			</div>

			{/* Search Panel */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
				<h4 className="text-sm font-extrabold text-slate-900 mb-5">Search By Area</h4>
				<div className="flex gap-5 items-end">
					<div className="flex-1 flex flex-col gap-2">
						<label className="text-[10px] font-extrabold text-slate-500 uppercase">Latitude</label>
						<input
							type="text"
							className="w-full px-3 py-2 text-sm bg-white border-2 border-slate-200 rounded 
                                focus:border-blue-600 focus:outline-none transition-colors"
							value={lat}
							onChange={(e) => setLat(e.target.value)}
							placeholder="28.6100"
						/>
					</div>
					<div className="flex-1 flex flex-col gap-2">
						<label className="text-[10px] font-extrabold text-slate-500 uppercase">Longitude</label>
						<input
							type="text"
							className="w-full px-3 py-2 text-sm bg-white border-2 border-slate-200 rounded 
                                focus:border-blue-600 focus:outline-none transition-colors"
							value={lng}
							onChange={(e) => setLng(e.target.value)}
							placeholder="77.2000"
						/>
					</div>
					<div className="flex-1 flex flex-col gap-2">
						<label className="text-[10px] font-extrabold text-slate-500 uppercase">
							Radius (km)
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 text-sm bg-white border-2 border-slate-200 rounded 
                                focus:border-blue-600 focus:outline-none transition-colors"
							value={radius}
							onChange={(e) => setRadius(e.target.value)}
							placeholder="5.0"
						/>
					</div>
					<button
						className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded 
                            hover:brightness-110 transition-all disabled:opacity-50"
						onClick={handleSearch}
						disabled={loading}
					>
						{loading ? "Searching..." : "Search"}
					</button>
				</div>
			</div>

			{/* Filters */}
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-4">
					<label className="text-sm font-semibold text-slate-600">Filter by Status:</label>
					<select
						className="w-50 px-3 py-2 text-sm bg-white border-2 border-slate-200 rounded 
                            focus:border-blue-600 focus:outline-none"
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as HardwareStatus | "all")}
					>
						<option value="all">All</option>
						<option value="active">Active</option>
						<option value="faulty">Faulty</option>
						<option value="config_failure">Config Failure</option>
					</select>
				</div>
				<div className="text-slate-500 text-sm">
					Showing {filteredHardware.length} of {hardware.length} units
					{searched && <span className="text-xs"> (searched)</span>}
				</div>
			</div>

			{/* Hardware List */}
			<div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
				{filteredHardware.length === 0 ? (
					<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
						<p className="text-slate-500">No hardware found matching your criteria.</p>
					</div>
				) : (
					filteredHardware.map((hw) => (
						<div
							key={hw.id}
							className={`bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-5 
                                border-l-4 ${
																	borderColors[hw.status]
																} shadow-sm hover:shadow-md transition-shadow`}
						>
							<div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
								{getTypeIcon(hw.type)}
							</div>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-3">
									<span className="font-extrabold font-mono text-slate-900">{hw.id}</span>
									{getStatusBadge(hw.status)}
								</div>
								<div className="text-xs font-bold text-slate-500 uppercase">
									{hw.type.replace("_", " ")}
								</div>
								<div className="text-sm text-blue-600 font-semibold font-mono flex items-center gap-1">
									<MapPin /> {hw.coordinates.lat.toFixed(4)}, {hw.coordinates.lng.toFixed(4)}
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

export default HardwareHealth;
