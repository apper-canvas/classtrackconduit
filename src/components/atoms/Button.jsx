import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
    secondary: "bg-gradient-to-r from-secondary to-secondary/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
    outline: "border-2 border-primary text-primary bg-white hover:bg-gradient-to-r hover:from-primary hover:to-primary/90 hover:text-white shadow-md hover:shadow-lg",
    ghost: "text-gray-700 hover:bg-surface hover:text-primary",
    success: "bg-gradient-to-r from-success to-success/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
    warning: "bg-gradient-to-r from-warning to-warning/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
    error: "bg-gradient-to-r from-error to-error/90 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
  };

  const sizes = {
    default: "px-6 py-3 text-base",
    sm: "px-4 py-2 text-sm",
    lg: "px-8 py-4 text-lg",
    icon: "p-3"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;