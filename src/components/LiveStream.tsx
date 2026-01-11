import React, { useState } from "react";

interface LiveStreamProps {
	src: string;
	title?: string;
}

const LiveStream: React.FC<LiveStreamProps> = ({ src, title = "Live CCTV Feed" }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	return (
		<div className="rounded-xl border border-slate-300 bg-slate-900 text-slate-50 shadow-inner overflow-hidden">
			<div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/80 text-xs uppercase tracking-wide">
				<span className="font-semibold">{title}</span>
				<span className="flex items-center gap-2 text-[10px] font-medium text-emerald-300">
					<span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live
				</span>
			</div>
			<div className="relative aspect-video bg-slate-950 flex items-center justify-center">
				{hasError ? (
					<p className="text-sm text-slate-300">Stream unavailable. Check connection.</p>
				) : (
					<>
						{isLoading && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
							</div>
						)}
						<iframe
							src={src}
							title={title}
							className="h-full w-full"
							allow="autoplay; encrypted-media"
							onLoad={() => setIsLoading(false)}
							onError={() => {
								setIsLoading(false);
								setHasError(true);
							}}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default LiveStream;
