import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal } from "lucide-react";
import { Button } from "../ui/Button";
import { PageContainer } from "../ui/Layouts";
import { Badge } from "../ui/Badge";

const stats = [
	{ value: "65,000", label: "km Track Coverage", suffix: "+" },
	{ value: "99.9", label: "Detection Accuracy", suffix: "%" },
	{ value: "<500", label: "Response Latency", suffix: "ms" },
	{ value: "0", label: "False Positives (Target)", suffix: "" },
];

function AnimatedCounter({ value, suffix }: { value: string; suffix: string }) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });
	const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
	const isNumeric = !isNaN(numericValue);
	const [displayValue, setDisplayValue] = useState(() => (isNumeric ? "0" : value));

	useEffect(() => {
		if (!isInView || !isNumeric) {
			return;
		}

		const start = 0;
		const duration = 1500;
		const startTime = Date.now();

		let animationFrame: number;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			const current = start + (numericValue - start) * eased;

			if (value.includes(",")) {
				setDisplayValue(Math.floor(current).toLocaleString());
			} else if (value.includes(".")) {
				setDisplayValue(current.toFixed(1));
			} else {
				setDisplayValue(Math.floor(current).toString());
			}

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(animationFrame);
	}, [isInView, isNumeric, numericValue, value]);

	const displayedValue = isNumeric ? displayValue : value;

	return (
		<span ref={ref}>
			{value.startsWith("<") ? "<" : ""}
			{displayedValue}
			{suffix}
		</span>
	);
}

export function Hero() {
	return (
		<div className="relative overflow-hidden bg-linear-to-b from-slate-50 to-white border-b border-slate-100">
			<div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-16px_16px"></div>
				<div className="absolute left-1/2 top-0 -translate-x-1/2 w-150 h-75 bg-blue-500/10 blur-[100px] rounded-full"></div>
			</div>

			<PageContainer className="relative z-10 pt-12 pb-10 md:pt-20 md:pb-16">
				<motion.div
					className="max-w-5xl mx-auto text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<motion.div
						className="flex justify-center mb-4"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.4 }}
					>
						<Badge
							variant="neutral"
							className="px-3 py-1 text-xs font-mono uppercase tracking-widest border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm"
						>
							<div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
							System Operational
						</Badge>
					</motion.div>

					<motion.h1
						className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 font-sans leading-[1.1]"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
					>
						TRIPLE-LOCK <span className="text-blue-600">AI SABOTAGE</span> PREVENTION
					</motion.h1>

					<motion.p
						className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.5 }}
					>
						Multi-modal threat detection using Distributed Acoustic Sensing, Thermal Imaging, and
						LiDAR Geometry for autonomous railway safety.
					</motion.p>

					<motion.div
						className="flex flex-col sm:flex-row items-center justify-center gap-3"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.5 }}
					>
						<Link to="/dashboard/overview">
							<Button
								size="lg"
								className="h-11 px-6 shadow-lg shadow-blue-500/15 font-bold tracking-wide"
							>
								<Terminal className="w-4 h-4 mr-2" />
								OPEN DASHBOARD
							</Button>
						</Link>
						<a href="#solution">
							<Button
								variant="outline"
								size="lg"
								className="h-11 px-6 bg-white border-slate-200 text-slate-700 font-medium hover:border-blue-300 transition-colors"
							>
								VIEW SPECS
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</a>
					</motion.div>
				</motion.div>

				{/* Stats Row */}
				<motion.div
					className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 0.6 }}
				>
					{stats.map((stat, idx) => (
						<div
							key={idx}
							className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-100 shadow-sm"
						>
							<div className="text-2xl md:text-3xl font-black text-slate-900 font-mono">
								<AnimatedCounter value={stat.value} suffix={stat.suffix} />
							</div>
							<div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
								{stat.label}
							</div>
						</div>
					))}
				</motion.div>
			</PageContainer>
		</div>
	);
}
