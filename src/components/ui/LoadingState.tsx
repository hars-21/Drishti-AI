export function LoadingState({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse space-y-4 ${className}`}>
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-32 bg-slate-100 rounded"></div>
        </div>
    );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-2",
        lg: "h-12 w-12 border-3",
    };

    return (
        <div className="flex items-center justify-center p-8">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-slate-200 border-t-blue-600`}
            ></div>
        </div>
    );
}
