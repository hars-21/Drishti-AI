import { FileQuestion } from "lucide-react";

export function EmptyState({
    title = "No data",
    description = "Nothing to display",
}: {
    title?: string;
    description?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileQuestion className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
    );
}
