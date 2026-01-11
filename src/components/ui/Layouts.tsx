import React from "react";
import { cn } from "../../lib/utils";

export function PageContainer({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
			{children}
		</div>
	);
}

export function Section({
	children,
	className,
	id,
}: {
	children: React.ReactNode;
	className?: string;
	id?: string;
}) {
	return (
		<section id={id} className={cn("py-12 md:py-16 lg:py-24", className)}>
			{children}
		</section>
	);
}
