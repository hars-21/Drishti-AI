import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
    product: [
        { label: "Dashboard", to: "/dashboard/overview" },
        { label: "Live Alerts", to: "/dashboard/alerts" },
        { label: "Simulation", to: "/dashboard/simulation" },
    ],
    technology: [
        { label: "DAS Acoustic", href: "#" },
        { label: "Thermal Vision", href: "#" },
        { label: "LiDAR Geometry", href: "#" },
    ],
    resources: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Research Papers", href: "#" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-6 h-6 bg-blue-700 rounded-sm flex items-center justify-center">
                                <div className="w-2 h-2 border border-white rounded-full"></div>
                            </div>
                            <span className="text-lg font-bold text-white font-mono tracking-tight">DRISHTI-AI</span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed mb-4">
                            Multi-modal AI system for autonomous railway sabotage prevention. Zero false positives. Instant response.
                        </p>
                        <div className="flex space-x-3">
                            <a href="#" className="text-slate-500 hover:text-white transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="text-slate-500 hover:text-white transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="text-slate-500 hover:text-white transition-colors">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-xs text-slate-500 hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Technology Links */}
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Technology</h4>
                        <ul className="space-y-2">
                            {footerLinks.technology.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-xs text-slate-500 hover:text-white transition-colors flex items-center">
                                        {link.label}
                                        <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Resources</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-xs text-slate-500 hover:text-white transition-colors flex items-center">
                                        {link.label}
                                        <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-[10px] text-slate-600 font-mono">
                        © 2026 DRISHTI-AI DEFENSE SYSTEMS. ALL RIGHTS RESERVED.
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-600 font-mono">
                        <span className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                            SYSTEM ONLINE
                        </span>
                        <span>v3.2.1-STABLE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
