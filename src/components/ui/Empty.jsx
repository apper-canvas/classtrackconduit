import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add New",
  onAction,
  icon = "FileText",
  type = "default" 
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "students":
        return {
          icon: "Users",
          title: "No students enrolled yet",
          description: "Start building your class roster by adding your first student.",
          actionLabel: "Add Student"
        };
      case "attendance":
        return {
          icon: "Calendar",
          title: "No attendance records",
          description: "Begin tracking attendance by marking students present or absent.",
          actionLabel: "Take Attendance"
        };
      case "grades":
        return {
          icon: "BookOpen",
          title: "No grades recorded",
          description: "Start recording student performance by adding your first grade.",
          actionLabel: "Add Grade"
        };
      case "classes":
        return {
          icon: "School",
          title: "No classes created",
          description: "Organize your students by creating your first class.",
          actionLabel: "Create Class"
        };
      default:
        return { icon, title, description, actionLabel };
    }
  };

  const config = getEmptyConfig();

  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
            <ApperIcon name={config.icon} className="h-12 w-12 text-gray-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
            <ApperIcon name="Plus" className="h-5 w-5 text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 font-display">{config.title}</h3>
          <p className="text-gray-600 leading-relaxed">{config.description}</p>
        </div>
        
        {onAction && (
          <Button onClick={onAction} className="mx-auto">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {config.actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;