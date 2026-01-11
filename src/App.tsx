import { Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "./components/landing/LandingPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { Dashboard } from "./pages/dashboard/DashboardMain";
import HardwareHealth from "./pages/dashboard/HardwareHealth";
import ActionHistoryPage from "./pages/dashboard/ActionHistoryPage";

function App() {
	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/dashboard" element={<DashboardLayout />}>
				<Route index element={<DashboardWrapper />} />
				<Route path="hardware" element={<HardwareHealth />} />
				<Route path="history" element={<ActionHistoryPage />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

function DashboardWrapper() {
	return <Dashboard onSelectAlert={() => { }} />;
}

export default App;
