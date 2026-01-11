import React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "default" | "glass" | "bordered";
}

export function Card({
    children,
    className,
    variant = "default",
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl shadow-sm transition-all duration-200",
                variant === "default" && "bg-white border border-slate-200 shadow-slate-200/50",
                variant === "glass" && "bg-white/70 backdrop-blur-md border border-white/40 shadow-xl",
                variant === "bordered" && "bg-transparent border-2 border-slate-200 hover:border-slate-300",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("p-6 pb-2", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h3 className={cn("text-lg font-bold text-slate-800 tracking-tight", className)}>{children}</h3>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("p-6 pt-2", className)}>{children}</div>;
}
