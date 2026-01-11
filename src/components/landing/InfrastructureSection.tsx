import { motion } from "framer-motion";
import { Cable, Server, Gauge } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";

export function InfrastructureSection() {
	return (
		<Section className="bg-white py-10 md:py-14 border-b border-slate-100">
			<PageContainer>
				<motion.div
					className="bg-linear-to-br from-slate-50 to-slate-100 rounded-2xl p-5 md:p-8 border border-slate-200 flex flex-col md:flex-row items-center gap-6 md:gap-10"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex-1">
						<h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
							Hardware Requirements
						</h2>
						<h3 className="text-xl font-bold text-slate-900 mb-3">Dark Fiber Utilization</h3>
						<p className="text-slate-600 text-sm mb-5 max-w-md">
							Leverages existing Optical Fiber Cable infrastructure. No new track-side cabling
							required. Passive sensing via Rayleigh Backscattering analysis.
						</p>
						<div className="flex gap-3">
							<motion.div
								className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
								whileHover={{ scale: 1.03, y: -2 }}
							>
								<Cable className="w-4 h-4 text-slate-400" />
								<div>
									<div className="text-lg font-bold text-slate-900 font-mono">0 km</div>
									<div className="text-[9px] text-slate-500 uppercase">New Cabling</div>
								</div>
							</motion.div>
							<motion.div
								className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
								whileHover={{ scale: 1.03, y: -2 }}
							>
								<Server className="w-4 h-4 text-slate-400" />
								<div>
									<div className="text-lg font-bold text-slate-900 font-mono">90%</div>
									<div className="text-[9px] text-slate-500 uppercase">Cost Saving</div>
								</div>
							</motion.div>
							<motion.div
								className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
								whileHover={{ scale: 1.03, y: -2 }}
							>
								<Gauge className="w-4 h-4 text-slate-400" />
								<div>
									<div className="text-lg font-bold text-slate-900 font-mono">65k</div>
									<div className="text-[9px] text-slate-500 uppercase">km Coverage</div>
								</div>
							</motion.div>
						</div>
					</div>

					<motion.div
						className="flex-1 flex justify-center w-full max-w-xs"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<div className="w-full h-28 bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
							<div className="absolute inset-0 opacity-20">
								<motion.div
									className="h-px bg-blue-400 w-full absolute top-1/3"
									animate={{ scaleX: [0, 1, 0], x: ["-100%", "0%", "100%"] }}
									transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
								/>
								<motion.div
									className="h-px bg-green-400 w-full absolute top-2/3"
									animate={{ scaleX: [0, 1, 0], x: ["100%", "0%", "-100%"] }}
									transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
								/>
							</div>
							<div className="text-center relative z-10">
								<div className="font-mono text-[10px] text-slate-400 uppercase">
									OFC Interrogator
								</div>
								<div className="font-mono text-xs text-blue-400 mt-1">RAYLEIGH BACKSCATTER</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</PageContainer>
		</Section>
	);
}
