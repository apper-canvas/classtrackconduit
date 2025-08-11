import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
const Header = ({ onMenuClick, onLogout }) => {
  const currentDate = format(new Date(), "EEEE, MMMM do, yyyy");

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ApperIcon name="Menu" className="h-6 w-6 text-gray-700" />
            </button>
            <div>
                <h2 className="text-lg font-semibold text-gray-900 font-display">Good morning!
                                </h2>
                <p className="text-sm text-gray-600">{currentDate}</p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-success/10 to-success/20 px-4 py-2 rounded-full border border-success/20">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium text-success">System Online</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <ApperIcon name="Bell" className="h-5 w-5 text-gray-700" />
                <span
                    className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-white" />
            </button>
            {onLogout && <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2">
                <ApperIcon name="LogOut" className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
            </Button>}
        </div>
    </div>
</header>
  );
};

export default Header;