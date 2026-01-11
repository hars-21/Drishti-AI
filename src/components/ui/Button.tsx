import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
}

export function Button({
    children,
    className,
    variant = "primary",
    size = "md",
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg",

                // Variants
                variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg shadow-blue-600/20",
                variant === "secondary" && "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500",
                variant === "outline" && "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700",
                variant === "ghost" && "bg-transparent hover:bg-slate-100 text-slate-700",
                variant === "danger" && "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-600/20",

                // Sizes
                size === "sm" && "h-8 px-3 text-sm",
                size === "md" && "h-10 px-4 py-2",
                size === "lg" && "h-12 px-6 text-lg",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
