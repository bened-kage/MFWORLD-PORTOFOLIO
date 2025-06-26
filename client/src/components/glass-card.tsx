import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-6",
        hover && "hover:glass-card",
        className
      )}
    >
      {children}
    </div>
  );
}
