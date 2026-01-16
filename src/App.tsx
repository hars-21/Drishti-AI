import { Navigate, Route, Routes } from "react-router-dom";
import { SimulationProvider } from "./context/SimulationContext";
import { NotificationProvider } from "./context/NotificationContext";
import { NotificationToast } from "./components/ui/NotificationToast";
import { NotificationConnector } from "./components/ui/NotificationConnector";
import { LandingPage } from "./components/landing/LandingPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { Dashboard } from "./pages/dashboard/DashboardMain";
import HardwareHealth from "./pages/dashboard/HardwareHealth";
import ActionHistoryPage from "./pages/dashboard/ActionHistoryPage";
import MapPage from "./pages/dashboard/MapPage";
import SimulationPage from "./pages/dashboard/SimulationPage";

function App() {
	return (
		<SimulationProvider>
			<NotificationProvider>
				<NotificationToast />
				<NotificationConnector />
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/dashboard" element={<DashboardLayout />}>
						<Route index element={<DashboardWrapper />} />
						<Route path="hardware" element={<HardwareHealth />} />
						<Route path="history" element={<ActionHistoryPage />} />
						<Route path="map" element={<MapPage />} />
						<Route path="simulation" element={<SimulationPage />} />
					</Route>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</NotificationProvider>
		</SimulationProvider>
	);
}

function DashboardWrapper() {
	return <Dashboard onSelectAlert={() => { }} />;
}

export default App;

