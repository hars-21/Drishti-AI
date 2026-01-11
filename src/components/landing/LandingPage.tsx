import { useEffect } from "react";
import { Hero } from "./Hero";
import { ProblemSection } from "./ProblemSection";
import { SolutionSection } from "./SolutionSection";
import { ConsensusSection } from "./ConsensusSection";
import { KavachSection } from "./KavachSection";
import { InfrastructureSection } from "./InfrastructureSection";
import { ImpactSection } from "./ImpactSection";
import { Footer } from "./Footer";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

export function LandingPage() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="min-h-screen bg-white font-sans text-slate-900">
			{/* Navbar */}
			<nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="w-6 h-6 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
							<div className="w-2 h-2 border-2 border-white rounded-full"></div>
						</div>
						<span className="text-base font-bold text-slate-900 tracking-tight font-mono">
							DRISHTI-AI
						</span>
					</div>
					<div className="flex items-center space-x-4">
						<div className="hidden md:flex text-[10px] font-mono text-slate-500 gap-4">
							<span>SEC: ENCRYPTED</span>
							<span className="flex items-center">
								<div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
								ONLINE
							</span>
						</div>
						<Link to="/dashboard/overview">
							<Button
								size="sm"
								variant="primary"
								className="h-8 text-xs font-bold uppercase tracking-wider px-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20"
							>
								Dashboard
								<LayoutDashboard className="w-3.5 h-3.5 ml-2" />
							</Button>
						</Link>
					</div>
				</div>
			</nav>

			<main>
				<Hero />
				<ProblemSection />
				<SolutionSection />
				<ConsensusSection />
				<KavachSection />
				<InfrastructureSection />
				<ImpactSection />
			</main>

			<Footer />
		</div>
	);
}
