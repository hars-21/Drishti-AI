import { motion } from "framer-motion";
import { Shield, Clock, Network, Users, Target, Zap } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";

const impacts = [
	{
		icon: Shield,
		title: "Safety First",
		description:
			"Prevents derailments and protects passenger lives through real-time sabotage detection",
		stat: "Zero tolerance",
	},
	{
		icon: Clock,
		title: "Operational Punctuality",
		description: "Eliminates false alarms that cause unnecessary delays and service disruptions",
		stat: "99.9% uptime",
	},
	{
		icon: Network,
		title: "Nationwide Scalability",
		description: "Works with existing infrastructure—deployable across 65,000+ km of track network",
		stat: "Pan-India ready",
	},
	{
		icon: Users,
		title: "Public Trust",
		description: "Restores confidence in automated safety systems through proven accuracy",
		stat: "Human-verified",
	},
];

export function ImpactSection() {
	return (
		<Section className="bg-slate-50 py-20 md:py-32 border-b border-slate-200">
			<PageContainer>
				{/* Section Header */}
				<motion.div
					className="max-w-3xl mx-auto text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 mb-4">
						<Target className="w-3.5 h-3.5 text-blue-700" />
						<span className="text-xs font-mono uppercase tracking-widest text-blue-700">
							Mission Impact
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
						Why This Matters
					</h2>
					<p className="text-lg text-slate-600 leading-relaxed">
						Railway safety is national infrastructure—every prevented incident protects lives,
						economies, and public trust in essential services.
					</p>
				</motion.div>

				{/* Impact Grid */}
				<div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
					{impacts.map((impact, index) => (
						<motion.div
							key={index}
							className="relative group"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
						>
							<div className="relative p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all overflow-hidden group">
								{/* Hover Glow */}
								<div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

								{/* Content */}
								<div className="relative z-10">
									<div className="flex items-start justify-between mb-4">
										<div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:border-slate-300 transition-colors">
											<impact.icon className="w-6 h-6 text-slate-600" />
										</div>
										<span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
											{impact.stat}
										</span>
									</div>
									<h3 className="text-xl font-bold text-slate-900 mb-3">{impact.title}</h3>
									<p className="text-slate-600 leading-relaxed">{impact.description}</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Bottom Statement */}
				<motion.div
					className="max-w-3xl mx-auto text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.5 }}
				>
					<div className="p-8 rounded-2xl bg-linear-to-br from-white to-slate-50 border border-slate-200 shadow-sm">
						<Zap className="w-8 h-8 text-blue-600 mx-auto mb-4" />
						<p className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-relaxed">
							Built for real railways.
							<br />
							Ready for deployment.
						</p>
						<p className="text-slate-600 text-sm">
							This isn't a concept demo—it's production-ready AI integrated with proven safety
							standards.
						</p>
					</div>
				</motion.div>
			</PageContainer>
		</Section>
	);
}
