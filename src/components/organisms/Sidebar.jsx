import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Grades", href: "/grades", icon: "BookOpen" },
    { name: "Classes", href: "/classes", icon: "School" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
            <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ClassTrack
            </h1>
            <p className="text-sm text-gray-500">Student Management</p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg transform scale-[1.02]"
                  : "text-gray-700 hover:bg-surface hover:text-primary hover:scale-[1.01]"
              )
            }
          >
            <ApperIcon name={item.icon} className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-surface to-gray-100 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent/90 rounded-lg flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Teacher Portal</p>
              <p className="text-xs text-gray-600">Active Session</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;