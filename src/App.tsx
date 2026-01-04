import type React from "react";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import DashboardLayout, {
	OverviewPage,
	AlertsPage,
	SensorsPage,
	LogsPage,
	HealthPage,
} from "./pages/dashboard";

type SectionProps = {
	title: string;
	subtitle?: string;
	id?: string;
	children: React.ReactNode;
};

type CardProps = {
	title: string;
	description: string;
	icon: string;
};

const Section = ({ title, subtitle, id, children }: SectionProps) => (
	<section id={id} className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
		<div className="mb-8 sm:mb-10">
			<h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
			{subtitle ? <p className="mt-2 text-slate-600 max-w-2xl">{subtitle}</p> : null}
		</div>
		{children}
	</section>
);

const Card = ({ title, description, icon }: CardProps) => (
	<div className="rounded-2xl bg-white shadow-[0_20px_45px_rgba(15,23,42,0.08)] border border-slate-100 p-6 transition-transform duration-200 hover:-translate-y-1">
		<div className="mb-4 text-2xl">{icon}</div>
		<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
		<p className="mt-2 text-slate-600 leading-relaxed">{description}</p>
	</div>
);

const Navbar = () => (
	<header className="sticky top-0 z-20 backdrop-blur bg-white/85 border-b border-slate-200">
		<div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
			<Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
				Drishti AI
			</Link>
			<nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
				<Link to="/" className="hover:text-slate-900 transition-colors">
					Home
				</Link>
				<Link to="/technology" className="hover:text-slate-900 transition-colors">
					Technology
				</Link>
				<Link to="/dashboard" className="hover:text-slate-900 transition-colors">
					Dashboard
				</Link>
			</nav>
		</div>
	</header>
);

const Hero = () => (
	<section id="home" className="relative overflow-hidden">
		<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.08),transparent_30%)]" />
		<div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
			<div className="max-w-3xl space-y-6">
				<h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900">
					Drishti AI
				</h1>
				<p className="text-xl sm:text-2xl font-medium text-slate-800">
					Triple-Lock Multimodal AI for Railway Safety
				</p>
				<p className="text-slate-600 max-w-2xl">
					A consensus-based intelligence system combining acoustic, thermal, and geometric sensing
					to prevent sabotage and infrastructure threats.
				</p>
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
					<a
						href="#technology"
						className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
					>
						Explore Technology
					</a>
					<a
						href="#flow"
						className="inline-flex items-center justify-center rounded-full border border-slate-300 text-slate-900 px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
					>
						View Architecture
					</a>
				</div>
			</div>
		</div>
	</section>
);

const PrincipleGrid = () => (
	<Section
		title="Consensus-Based Intelligence"
		subtitle="Three independent modalities collaborate to validate every alert."
	>
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<Card
				title="Acoustic Intelligence"
				description="Wavelet-based filtering to isolate sabotage signatures from ambient rail noise."
				icon="🔊"
			/>
			<Card
				title="Thermal Verification"
				description="IR-based human presence confirmation at vibration-triggered coordinates."
				icon="🌡️"
			/>
			<Card
				title="Geometry Awareness"
				description="LiDAR & stereo vision detect physical anomalies even in silence."
				icon="📡"
			/>
		</div>
	</Section>
);

const Flow = () => (
	<Section
		id="flow"
		title="Triple-Lock Flow"
		subtitle="Detect, verify, and decide with minimal false positives."
	>
		<div className="grid gap-4 sm:grid-cols-3">
			{[
				{
					title: "Detect",
					detail: "Signal spikes from DAS and on-rail sensors trigger localized scrutiny.",
				},
				{
					title: "Verify",
					detail: "Thermal and geometric layers confirm presence, mass, and motion.",
				},
				{
					title: "Decide",
					detail: "Consensus logic assigns risk tier and routes to Kavach in real time.",
				},
			].map((step, index) => (
				<div
					key={step.title}
					className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
				>
					<div className="text-sm font-semibold text-slate-500 mb-2">{index + 1}</div>
					<h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
					<p className="mt-2 text-slate-600">{step.detail}</p>
				</div>
			))}
		</div>
	</Section>
);

const Kavach = () => (
	<Section id="technology" title="Native Kavach Integration (SIL-4)">
		<div className="rounded-2xl border border-slate-200 bg-linear-to-r from-white via-slate-50 to-white shadow-[0_20px_45px_rgba(15,23,42,0.08)] p-8 flex flex-col gap-4">
			<p className="text-slate-700 text-lg">
				Drishti AI communicates directly with Loco-Kavach to enable automatic emergency braking—no
				human delay.
			</p>
			<div className="flex flex-wrap gap-3 text-sm text-slate-600">
				<span className="px-3 py-1 rounded-full bg-slate-900 text-white">
					Safety Integrity Level 4
				</span>
				<span className="px-3 py-1 rounded-full border border-slate-300">Sub-50 ms dispatch</span>
				<span className="px-3 py-1 rounded-full border border-slate-300">Secure link-layer</span>
			</div>
		</div>
	</Section>
);

const Infrastructure = () => (
	<Section
		title="Infrastructure Reuse"
		subtitle="Reduce rollout cost with fiber already in the ground."
	>
		<div className="grid gap-8 lg:grid-cols-2 items-center">
			<div className="space-y-4 text-slate-700">
				<p className="text-lg">
					Existing railway OFC reused as a 50km-long acoustic sensor using Distributed Acoustic
					Sensing (DAS), reducing hardware costs by 90%.
				</p>
				<div className="flex gap-3 text-sm text-slate-600">
					<span className="px-3 py-1 rounded-full border border-slate-300">Fiber-first</span>
					<span className="px-3 py-1 rounded-full border border-slate-300">Low capex</span>
					<span className="px-3 py-1 rounded-full border border-slate-300">50 km reach</span>
				</div>
			</div>
			<div className="relative h-64 rounded-2xl bg-linear-to-br from-slate-100 via-white to-slate-100 border border-slate-200 overflow-hidden">
				<div className="absolute inset-6 rounded-xl border border-dashed border-slate-300" />
				<div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-2 rounded-full bg-linear-to-r from-sky-300 via-emerald-300 to-sky-300" />
				<div className="absolute inset-y-10 left-12 w-16 rounded-xl bg-white shadow-lg border border-slate-200" />
				<div className="absolute inset-y-14 right-16 w-14 rounded-xl bg-white shadow-lg border border-slate-200" />
			</div>
		</div>
	</Section>
);

const RiskTiers = () => (
	<Section
		title="Risk-Tiered Logic"
		subtitle="Prevent unnecessary train stoppage with graded responses."
	>
		<div className="grid gap-4 sm:grid-cols-3">
			{[
				{
					label: "Informational",
					color: "bg-blue-50 text-blue-900 border border-blue-100",
					detail: "Low-confidence signals logged for trend analysis.",
				},
				{
					label: "Advisory",
					color: "bg-amber-50 text-amber-900 border border-amber-100",
					detail: "Operator notified with live feed to validate context.",
				},
				{
					label: "Emergency",
					color: "bg-rose-50 text-rose-900 border border-rose-100",
					detail: "Consensus breach triggers Kavach-linked braking.",
				},
			].map((tier) => (
				<div key={tier.label} className={`rounded-2xl p-5 shadow-sm ${tier.color}`}>
					<h3 className="text-lg font-semibold">{tier.label}</h3>
					<p className="mt-2 text-sm leading-relaxed">{tier.detail}</p>
				</div>
			))}
		</div>
	</Section>
);

const Footer = () => (
	<footer id="contact" className="border-t border-slate-200 bg-white">
		<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-2 text-sm text-slate-600">
			<span className="font-semibold text-slate-900">Drishti AI</span>
			<span>Triple-Lock Multimodal AI</span>
			<div className="flex gap-4 text-slate-500">
				<a href="mailto:contact@drishti.ai" className="hover:text-slate-900 transition-colors">
					contact@drishti.ai
				</a>
				<a href="tel:+911234567890" className="hover:text-slate-900 transition-colors">
					+91 12345 67890
				</a>
			</div>
		</div>
	</footer>
);

const LandingPage = () => (
	<div className="min-h-screen bg-white text-slate-900">
		<Navbar />
		<Hero />
		<PrincipleGrid />
		<Flow />
		<Kavach />
		<Infrastructure />
		<RiskTiers />
		<Footer />
	</div>
);

const TechnologyPage = () => (
	<div className="min-h-screen bg-white text-slate-900">
		<Navbar />
		<Section title="System Overview" subtitle="How Drishti AI orchestrates multimodal safety.">
			<div className="space-y-4 text-slate-700 max-w-4xl">
				<p>
					Signals from DAS, thermal cameras, and geometric sensors feed a fusion core that scores
					credibility and assigns risk tiers in milliseconds.
				</p>
				<p>
					Edge nodes near rail clusters run the fusion logic with Kavach-ready outputs to keep the
					loop deterministic and resilient.
				</p>
			</div>
		</Section>
		<Section title="Modal Breakdown" subtitle="Purpose-built processing across three modalities.">
			<div className="grid gap-6 sm:grid-cols-3">
				<Card
					title="Acoustic Layer"
					description="Distributed Acoustic Sensing with wavelets to pinpoint sabotage vibrations."
					icon="🎚️"
				/>
				<Card
					title="Thermal Layer"
					description="IR plus YOLOv8 to verify human presence and motion vectors."
					icon="🔥"
				/>
				<Card
					title="Geometry Layer"
					description="LiDAR and stereo vision to detect physical anomalies on and near the track."
					icon="🛰️"
				/>
			</div>
		</Section>
		<Section
			title="Decision Logic"
			subtitle="Consensus-first, risk-tiered alerts to avoid false stops."
		>
			<div className="space-y-3 text-slate-700 max-w-4xl">
				<p>
					Each modality votes on confidence; only converged signals advance to advisory or emergency
					tiers.
				</p>
				<p>
					Advisory alerts surface to operators with live feeds, while emergency consensus links to
					Kavach for automatic braking.
				</p>
			</div>
		</Section>
		<Footer />
	</div>
);

function App() {
	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/technology" element={<TechnologyPage />} />
			<Route path="/dashboard/*" element={<DashboardLayout />}>
				<Route index element={<OverviewPage />} />
				<Route path="alerts" element={<AlertsPage />} />
				<Route path="sensors" element={<SensorsPage />} />
				<Route path="logs" element={<LogsPage />} />
				<Route path="health" element={<HealthPage />} />
				<Route path="*" element={<Navigate to="/dashboard" replace />} />
			</Route>
			<Route path="*" element={<Navigate to="/dashboard" replace />} />
		</Routes>
	);
}

export default App;
