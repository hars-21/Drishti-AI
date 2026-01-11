import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal, Waves } from "lucide-react";
import { Button } from "../ui/Button";
import { PageContainer } from "../ui/Layouts";

export function Hero() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Animated waveform background
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationId: number;
		let time = 0;

		const resize = () => {
			canvas.width = canvas.offsetWidth * 2;
			canvas.height = canvas.offsetHeight * 2;
			ctx.scale(2, 2);
		};

		resize();
		window.addEventListener("resize", resize);

		const animate = () => {
			const width = canvas.offsetWidth;
			const height = canvas.offsetHeight;

			ctx.clearRect(0, 0, width, height);

			// Draw multiple wave layers
			const waves = [
				{ amplitude: 30, frequency: 0.01, speed: 0.02, color: "rgba(59, 130, 246, 0.15)" },
				{ amplitude: 20, frequency: 0.015, speed: 0.015, color: "rgba(147, 51, 234, 0.1)" },
				{ amplitude: 25, frequency: 0.012, speed: 0.025, color: "rgba(59, 130, 246, 0.08)" },
			];

			waves.forEach((wave) => {
				ctx.beginPath();
				ctx.strokeStyle = wave.color;
				ctx.lineWidth = 2;

				for (let x = 0; x < width; x++) {
					const y =
						height / 2 +
						Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
						Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.7) * wave.amplitude * 0.5;

					if (x === 0) {
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}
				}

				ctx.stroke();
			});

			time += 1;
			animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resize);
			cancelAnimationFrame(animationId);
		};
	}, []);

	return (
		<div className="relative overflow-hidden bg-linear-to-b from-white via-blue-50 to-white border-b border-slate-200">
			{/* Animated Background Grid */}
			<div className="absolute inset-0 z-0 opacity-30">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-size-4rem_4rem"></div>
			</div>

			{/* Animated Waveform Canvas */}
			<canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />

			{/* Gradient Orbs */}
			<div className="absolute inset-0 z-0 overflow-hidden">
				<motion.div
					className="absolute left-1/4 top-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"
					animate={{
						x: [0, 50, 0],
						y: [0, 30, 0],
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full"
					animate={{
						x: [0, -50, 0],
						y: [0, -30, 0],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</div>

			<PageContainer className="relative z-10 py-20 md:py-32">
				<motion.div
					className="max-w-5xl mx-auto text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					{/* System Status Badge */}
					<motion.div
						className="flex justify-center mb-6"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm">
							<div className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
							</div>
							<span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
								System Operational
							</span>
						</div>
					</motion.div>

					{/* Main Headline with Gradient */}
					<motion.h1
						className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.8 }}
					>
						<span className="text-slate-900">TRIPLE-LOCK</span>
						<br />
						<span className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-length-200%_auto animate-gradient">
							MULTI-MODAL AI
						</span>
						<br />
						<span className="text-slate-700">for Railway Sabotage Prevention</span>
					</motion.h1>

					{/* Subtitle */}
					<motion.p
						className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.8 }}
					>
						Consensus-based AI that stops{" "}
						<span className="text-slate-900 font-semibold">real threats</span>, not trains.
						<br />
						Built with DAS, Thermal Imaging, and LiDAR to eliminate false positives.
					</motion.p>

					{/* CTA Buttons */}
					<motion.div
						className="flex flex-col sm:flex-row items-center justify-center gap-4"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7, duration: 0.6 }}
					>
						<Link to="/dashboard/overview">
							<Button
								size="lg"
								className="h-14 px-8 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 transition-all group"
							>
								<Terminal className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
								Enter Control Center
							</Button>
						</Link>
						<a href="#solution">
							<Button
								variant="outline"
								size="lg"
								className="h-14 px-8 text-base font-semibold bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 group"
							>
								See How It Works
								<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
							</Button>
						</a>
					</motion.div>

					{/* Scroll Indicator */}
					<motion.div
						className="mt-16 flex flex-col items-center gap-2"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1, duration: 0.8 }}
					>
						<Waves className="w-5 h-5 text-slate-400" />
						<motion.div
							className="w-0.5 h-8 bg-linear-to-b from-slate-400 to-transparent"
							animate={{ height: [32, 48, 32] }}
							transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
						/>
					</motion.div>
				</motion.div>
			</PageContainer>

			{/* Add gradient animation keyframes to global styles */}
			<style>{`
				@keyframes gradient {
					0%, 100% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
				}
				.animate-gradient {
					animation: gradient 3s ease infinite;
				}
			`}</style>
		</div>
	);
}
