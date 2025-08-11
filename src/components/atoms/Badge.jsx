import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    success: "bg-gradient-to-r from-success/20 to-success/30 text-success border-success/20",
    warning: "bg-gradient-to-r from-warning/20 to-warning/30 text-warning border-warning/20",
    error: "bg-gradient-to-r from-error/20 to-error/30 text-error border-error/20",
    info: "bg-gradient-to-r from-info/20 to-info/30 text-info border-info/20",
    primary: "bg-gradient-to-r from-primary/20 to-primary/30 text-primary border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/20 to-secondary/30 text-secondary border-secondary/20"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;