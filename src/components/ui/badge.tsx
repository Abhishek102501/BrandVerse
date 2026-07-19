import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" &&
          "bg-primary text-primary-foreground",
        variant === "secondary" &&
          "bg-secondary text-secondary-foreground",
        variant === "outline" &&
          "border",
        variant === "destructive" &&
          "bg-destructive text-destructive-foreground",
        className
      )}
      {...props}
    />
  );
}