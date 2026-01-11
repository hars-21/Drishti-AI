import { motion } from "framer-motion";
import { ShieldCheck, Zap, User, ArrowRight } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";

const safetyFeatures = [
	{
		icon: ShieldCheck,
		title: "SIL-4 Logic",
		description: "Safety Integrity Level 4 compliant decision architecture",
	},
	{
		icon: Zap,
		title: "Fail-Safe Default",
		description: "System defaults to safe state on any component failure",
	},
	{
		icon: User,
		title: "Human Override",
		description: "Operators maintain final authority over all AI decisions",
	},
];

export function KavachSection() {
	return (
		<Section className="bg-white py-20 md:py-32 border-b border-slate-200">
			<PageContainer>
				{/* Section Header */}
				<motion.div
					className="max-w-3xl mx-auto text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 mb-4">
						<ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
						<span className="text-xs font-mono uppercase tracking-widest text-emerald-700">
							Safety Integration
						</span>
					</div>
					<h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
						Kavach-Compatible Architecture
					</h2>
					<p className="text-lg text-slate-600 leading-relaxed">
						Seamlessly integrates with Indian Railways' ATP system for automatic train protection.
					</p>
				</motion.div>

				<div className="max-w-5xl mx-auto">
					{/* Safety Badges */}
					<motion.div
						className="grid md:grid-cols-3 gap-6 mb-16"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						{safetyFeatures.map((feature, index) => (
							<motion.div
								key={index}
								className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center group hover:border-slate-300 transition-colors"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 mb-4 group-hover:border-slate-300 transition-colors">
									<feature.icon className="w-7 h-7 text-slate-600" />
								</div>
								<h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
								<p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
							</motion.div>
						))}
					</motion.div>

					{/* Flow Diagram */}
					<motion.div
						className="relative p-8 md:p-12 rounded-3xl bg-linear-to-br from-white to-slate-50 border border-slate-200 shadow-sm overflow-hidden"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						{/* Background Pattern */}
						<div className="absolute inset-0 opacity-5">
							<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-2rem_2rem"></div>
						</div>

						{/* Title */}
						<div className="relative z-10 text-center mb-8">
							<div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
								Integration Flow
							</div>
							<h3 className="text-2xl font-bold text-slate-900">
								AI Decision → Kavach → Emergency Response
							</h3>
						</div>

						{/* Flow Steps */}
						<div className="relative z-10 grid md:grid-cols-3 gap-6 items-center">
							{/* Step 1: AI Analysis */}
							<motion.div
								className="relative"
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.5 }}
							>
								<div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
									<div className="text-xs font-mono text-blue-700 mb-2 uppercase tracking-widest">
										Step 1
									</div>
									<h4 className="text-lg font-bold text-slate-900 mb-2">AI Detection</h4>
									<p className="text-sm text-slate-600 leading-relaxed">
										Triple-Lock consensus validates threat and generates alert signal
									</p>
									<div className="mt-4 pt-4 border-t border-slate-200">
										<div className="text-xs font-mono text-slate-600">Latency: &lt;500ms</div>
									</div>
								</div>
							</motion.div>

							{/* Arrow */}
							<div className="hidden md:flex justify-center">
								<motion.div
									animate={{
										x: [0, 5, 0],
										opacity: [0.5, 1, 0.5],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut",
									}}
								>
									<ArrowRight className="w-8 h-8 text-slate-700" />
								</motion.div>
							</div>

							{/* Step 2: Kavach Processing */}
							<motion.div
								className="relative"
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.7 }}
							>
								<div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
									<div className="text-xs font-mono text-purple-700 mb-2 uppercase tracking-widest">
										Step 2
									</div>
									<h4 className="text-lg font-bold text-slate-900 mb-2">Kavach ATP</h4>
									<p className="text-sm text-slate-600 leading-relaxed">
										Indian Railways ATP system validates and authorizes braking command
									</p>
									<div className="mt-4 pt-4 border-t border-slate-200">
										<div className="text-xs font-mono text-slate-600">SIL-4 Certified</div>
									</div>
								</div>
							</motion.div>

							{/* Arrow */}
							<div className="hidden md:flex justify-center">
								<motion.div
									animate={{
										x: [0, 5, 0],
										opacity: [0.5, 1, 0.5],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 0.5,
									}}
								>
									<ArrowRight className="w-8 h-8 text-slate-700" />
								</motion.div>
							</div>

							{/* Step 3: Emergency Braking */}
							<motion.div
								className="relative"
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.9 }}
							>
								<div className="p-6 rounded-xl bg-linear-to-br from-rose-50 to-amber-50 border border-rose-200 shadow-sm">
									<div className="text-xs font-mono text-red-700 mb-2 uppercase tracking-widest">
										Step 3
									</div>
									<h4 className="text-lg font-bold text-slate-900 mb-2">Emergency Brake</h4>
									<p className="text-sm text-slate-600 leading-relaxed">
										Automatic train protection system engages emergency braking
									</p>
									<div className="mt-4 pt-4 border-t border-rose-200">
										<div className="text-xs font-mono text-slate-600">Fail-Safe Default</div>
									</div>
								</div>
							</motion.div>
						</div>

						{/* Bottom Note */}
						<motion.div
							className="relative z-10 mt-8 pt-6 border-t border-slate-200 text-center"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 1.1 }}
						>
							<p className="text-sm text-slate-500 font-mono">
								Complete end-to-end latency: &lt;2 seconds from detection to brake engagement
							</p>
						</motion.div>
					</motion.div>

					{/* Credibility Statement */}
					<motion.div
						className="mt-12 text-center"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.5 }}
					>
						<p className="text-slate-500 leading-relaxed max-w-2xl mx-auto">
							This architecture ensures AI enhances safety without replacing critical human
							oversight and regulatory compliance frameworks.
						</p>
					</motion.div>
				</div>
			</PageContainer>
		</Section>
	);
}
