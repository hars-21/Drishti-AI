import { AlertCircle } from "lucide-react";

export function ErrorState({
    title = "Something went wrong",
    description = "Please try again later",
}: {
    title?: string;
    description?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
    );
}
