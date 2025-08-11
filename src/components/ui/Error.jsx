import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "default" }) => {
  const getErrorIcon = () => {
    if (message.toLowerCase().includes("network")) return "Wifi";
    if (message.toLowerCase().includes("not found")) return "Search";
    return "AlertTriangle";
  };

  if (type === "inline") {
    return (
      <div className="bg-gradient-to-r from-error/5 to-error/10 border border-error/20 rounded-lg p-4 my-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-error to-error/90 rounded-full flex items-center justify-center shadow-md">
            <ApperIcon name={getErrorIcon()} className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-error font-medium">{message}</p>
          </div>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="border-error text-error hover:bg-error hover:text-white">
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-error/10 to-error/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-error/20">
            <ApperIcon name={getErrorIcon()} className="h-10 w-10 text-error" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-error to-error/90 rounded-full flex items-center justify-center shadow-lg">
            <ApperIcon name="X" className="h-3 w-3 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 font-display">Oops! Something went wrong</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        
        {onRetry && (
          <Button onClick={onRetry} className="mx-auto">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;