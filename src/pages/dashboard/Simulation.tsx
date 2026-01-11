import { useState } from "react";
import { Play, Siren, RefreshCcw, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

export default function Simulation() {
	const [activeScenario, setActiveScenario] = useState<string | null>(null);
	const [step, setStep] = useState(0);

	const scenarios = [
		{
			id: "false-alarm",
			label: "Cat on Track (False Alarm)",
			severity: "Low",
			color: "text-blue-600",
			bg: "bg-blue-50",
		},
		{
			id: "sabotage",
			label: "Rail Cutting (Sabotage)",
			severity: "Critical",
			color: "text-red-600",
			bg: "bg-red-50",
		},
		{
			id: "obstacle",
			label: "Boulder on Track",
			severity: "High",
			color: "text-orange-600",
			bg: "bg-orange-50",
		},
	];

	const handleSimulate = (id: string) => {
		setActiveScenario(id);
		setStep(0);

		// Simulate progression
		let currentStep = 0;
		const interval = setInterval(() => {
			currentStep++;
			setStep(currentStep);
			if (currentStep >= 4) clearInterval(interval);
		}, 1500);
	};

	const getStepStatus = (simStep: number, currentStep: number) => {
		if (currentStep > simStep) return "completed";
		if (currentStep === simStep) return "active";
		return "pending";
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-slate-900 tracking-tight">Scenario Simulation</h1>
				<p className="text-slate-500">Test system response against various threat vectors.</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{scenarios.map((scen) => (
					<button
						key={scen.id}
						onClick={() => handleSimulate(scen.id)}
						className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${
							activeScenario === scen.id
								? "border-blue-500 shadow-xl ring-2 ring-blue-500/20"
								: "border-slate-200 bg-white hover:border-blue-300"
						}`}
					>
						<div className={`p-3 rounded-lg w-fit ${scen.bg} ${scen.color} mb-4`}>
							<Play className="w-6 h-6" />
						</div>
						<h3 className="text-lg font-bold text-slate-900">{scen.label}</h3>
						<div className="mt-2 flex items-center justify-between">
							<span className="text-sm text-slate-500">Severity Test</span>
							<Badge
								variant={
									scen.severity === "Critical"
										? "error"
										: scen.severity === "High"
										? "warning"
										: "info"
								}
							>
								{scen.severity}
							</Badge>
						</div>
					</button>
				))}
			</div>

			{activeScenario && (
				<Card className="border-t-4 border-t-blue-500 animate-fade-in-up">
					<CardContent className="p-8">
						<div className="flex items-center justify-between mb-8">
							<h2 className="text-2xl font-bold flex items-center gap-3">
								Simulation: {scenarios.find((s) => s.id === activeScenario)?.label}
								{step >= 4 && <Badge variant="success">Completed</Badge>}
							</h2>
							<Button variant="outline" size="sm" onClick={() => setActiveScenario(null)}>
								<RefreshCcw className="w-4 h-4 mr-2" />
								Reset
							</Button>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							{[
								"Signal Detection",
								"Multi-Modal Verification",
								"Risk Assessment",
								"Kavach Response",
							].map((label, idx) => {
								const status = getStepStatus(idx, step);
								return (
									<div
										key={idx}
										className={`p-4 rounded-lg border transition-all duration-500 ${
											status === "active"
												? "bg-blue-50 border-blue-200 scale-105 shadow-lg"
												: status === "completed"
												? "bg-green-50 border-green-200 opacity-80"
												: "bg-slate-50 border-slate-100 opacity-50"
										}`}
									>
										<div className="flex items-center justify-between mb-3">
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
													status === "active"
														? "bg-blue-600 text-white"
														: status === "completed"
														? "bg-green-600 text-white"
														: "bg-slate-200 text-slate-500"
												}`}
											>
												{idx + 1}
											</div>
											{status === "active" && (
												<div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
											)}
											{status === "completed" && (
												<CheckCircle2 className="w-5 h-5 text-green-600" />
											)}
										</div>
										<div className="font-bold text-slate-900">{label}</div>
										<div className="text-sm text-slate-500 mt-1">
											{status === "active"
												? "Processing..."
												: status === "completed"
												? "Done"
												: "Waiting"}
										</div>
									</div>
								);
							})}
						</div>

						{step >= 4 && activeScenario === "sabotage" && (
							<div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center animate-pulse">
								<Siren className="w-8 h-8 text-red-600 mr-4" />
								<div className="text-xl font-bold text-red-800">EMERGENCY BRAKES APPLIED</div>
							</div>
						)}

						{step >= 4 && activeScenario === "false-alarm" && (
							<div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
								<CheckCircle2 className="w-8 h-8 text-green-600 mr-4" />
								<div className="text-xl font-bold text-green-800">
									NO ACTION TAKEN - THREAT DISMISSED
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
