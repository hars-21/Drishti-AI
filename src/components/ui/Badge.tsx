import { cn } from "../../lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "info" | "success" | "warning" | "error" | "neutral";
    className?: string;
}

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                variant === "neutral" && "bg-slate-50 text-slate-600 ring-slate-500/10",
                variant === "info" && "bg-blue-50 text-blue-700 ring-blue-700/10",
                variant === "success" && "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
                variant === "warning" && "bg-amber-50 text-amber-800 ring-amber-600/20",
                variant === "error" && "bg-red-50 text-red-700 ring-red-600/10",
                className
            )}
        >
            {children}
        </span>
    );
}
