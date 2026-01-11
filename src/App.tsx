import { Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "./components/landing/LandingPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import LiveAlerts from "./pages/dashboard/LiveAlerts";
import IncidentDetails from "./pages/dashboard/IncidentDetails";
import SensorHealth from "./pages/dashboard/SensorHealth";
import Simulation from "./pages/dashboard/Simulation";

function App() {
	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/dashboard" element={<DashboardLayout />}>
				<Route index element={<Navigate to="overview" replace />} />
				<Route path="overview" element={<Overview />} />
				<Route path="alerts" element={<LiveAlerts />} />
				<Route path="incidents" element={<IncidentDetails />} />
				<Route path="health" element={<SensorHealth />} />
				<Route path="simulation" element={<Simulation />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default App;
