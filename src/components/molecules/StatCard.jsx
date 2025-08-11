import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change = null, 
  changeType = "neutral",
  gradient = "from-primary to-primary/90",
  className = ""
}) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-600"
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
            {change !== null && (
              <p className={cn("text-sm font-medium mt-1", changeColors[changeType])}>
                {changeType === "positive" && "+"}
                {change}
                {changeType !== "neutral" && (
                  <ApperIcon 
                    name={changeType === "positive" ? "TrendingUp" : "TrendingDown"}
                    className="inline ml-1 h-4 w-4"
                  />
                )}
              </p>
            )}
          </div>
          
          <div className={cn(
            "w-14 h-14 rounded-xl bg-gradient-to-r flex items-center justify-center shadow-lg",
            gradient
          )}>
            <ApperIcon name={icon} className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;