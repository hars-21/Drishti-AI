import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Network, TrendingDown, Zap } from "lucide-react";
import { Section, PageContainer } from "../ui/Layouts";

export function InfrastructureSection() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		if (!isInView) return;

		const duration = 2000;
		const startTime = Date.now();
		let animationFrame: number;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			const current = Math.floor(eased * 90);

			setDisplayValue(current);

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrame);
	}, [isInView]);

	return (
		<Section className="bg-slate-50 py-20 md:py-32 border-b border-slate-200">
			<PageContainer>
				<div className="max-w-6xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left: Big Stat */}
						<motion.div
							ref={ref}
							className="text-center lg:text-left"
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 mb-6">
								<TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
								<span className="text-xs font-mono uppercase tracking-widest text-emerald-700">
									Cost Efficiency
								</span>
							</div>

							<div className="mb-6">
								<motion.div
									className="text-8xl md:text-9xl font-black mb-2 leading-none"
									initial={{ scale: 0.8, opacity: 0 }}
									whileInView={{ scale: 1, opacity: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.8, delay: 0.2 }}
								>
									<span className="text-transparent bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text">
										{displayValue}%
									</span>
								</motion.div>
								<motion.div
									className="text-2xl md:text-3xl font-bold text-slate-900 mb-4"
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.4 }}
								>
									Hardware Cost Reduction
								</motion.div>
								<motion.p
									className="text-lg text-slate-600 max-w-md mx-auto lg:mx-0 leading-relaxed"
									initial={{ opacity: 0 }}
									whileInView={{ opacity: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.6 }}
								>
									By leveraging existing Optical Fiber Cable infrastructure for Distributed Acoustic
									Sensing, deployment costs drop dramatically.
								</motion.p>
							</div>

							{/* Stats Grid */}
							<motion.div
								className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.8 }}
							>
								<div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
									<div className="text-2xl font-black text-slate-900 mb-1">65,000+</div>
									<div className="text-xs uppercase tracking-wider text-slate-500">km Coverage</div>
								</div>
								<div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
									<div className="text-2xl font-black text-slate-900 mb-1">₹0</div>
									<div className="text-xs uppercase tracking-wider text-slate-500">
										New Cable Cost
									</div>
								</div>
							</motion.div>
						</motion.div>

						{/* Right: Visual Explanation */}
						<motion.div
							className="relative"
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							<div className="relative p-8 md:p-12 rounded-3xl bg-linear-to-br from-white to-slate-50 border border-slate-200 shadow-sm overflow-hidden">
								{/* Background Grid */}
								<div className="absolute inset-0 opacity-10">
									<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-1.5rem_1.5rem"></div>
								</div>

								{/* Content */}
								<div className="relative z-10 space-y-6">
									<div className="flex items-center gap-3 mb-8">
										<div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center border border-slate-200">
											<Network className="w-6 h-6 text-slate-900" />
										</div>
										<div>
											<div className="text-sm font-mono text-slate-500 uppercase tracking-widest">
												Technology
											</div>
											<div className="text-lg font-bold text-slate-900">OFC → DAS Conversion</div>
										</div>
									</div>

									{/* Flow Visualization */}
									<div className="space-y-4">
										{/* Existing Infrastructure */}
										<motion.div
											className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm"
											initial={{ opacity: 0, x: -20 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true }}
											transition={{ delay: 0.4 }}
										>
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-bold text-slate-900">
													Existing OFC Network
												</span>
												<span className="text-xs font-mono text-emerald-400">REUSED</span>
											</div>
											<p className="text-xs text-slate-600 leading-relaxed">
												Indian Railways already has fiber optic cables running alongside tracks for
												signaling and communication.
											</p>
										</motion.div>

										{/* Arrow */}
										<div className="flex justify-center">
											<motion.div
												animate={{
													y: [0, 5, 0],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut",
												}}
											>
												<Zap className="w-5 h-5 text-cyan-400" />
											</motion.div>
										</div>

										{/* DAS Conversion */}
										<motion.div
											className="p-4 rounded-xl bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200"
											initial={{ opacity: 0, x: -20 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true }}
											transition={{ delay: 0.6 }}
										>
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-bold text-slate-900">
													DAS Interrogator Unit
												</span>
												<span className="text-xs font-mono text-blue-400">NEW</span>
											</div>
											<p className="text-xs text-slate-600 leading-relaxed">
												Single interrogator converts 40km of fiber into a continuous acoustic sensor
												array.
											</p>
										</motion.div>
									</div>

									{/* Bottom Note */}
									<div className="pt-6 border-t border-slate-300/50">
										<p className="text-xs text-slate-500 font-mono">
											Traditional sensor arrays would require laying new cables and installing
											sensors every 100m—costing millions per kilometer.
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</PageContainer>
		</Section>
	);
}
