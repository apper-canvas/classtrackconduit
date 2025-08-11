import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  options = [], 
  error, 
  className = "",
  required = false,
  ...props 
}) => {
const isSelect = type === "select";
  const Component = isSelect ? Select : Input;
  const safeOptions = options || [];

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700 font-display">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      
      <Component
        {...props}
        className={cn(
          error ? "border-error focus:border-error focus:ring-error/20" : ""
        )}
      >
        {isSelect && (
          <>
            <option value="">Select {label ? label.toLowerCase() : 'option'}</option>
            {safeOptions.map((option) => (
              <option key={option?.value || Math.random()} value={option?.value || ""}>
                {option?.label || option?.value || 'Unknown option'}
              </option>
            ))}
          </>
        )}
      </Component>
      
      {error && (
        <p className="text-sm text-error font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;