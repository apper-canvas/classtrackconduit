import React from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const StudentTable = ({ students, onEdit, onDelete }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: { variant: "success", icon: "CheckCircle" },
      Inactive: { variant: "error", icon: "XCircle" },
      Suspended: { variant: "warning", icon: "AlertCircle" }
    };
    
    const config = statusConfig[status] || statusConfig.Active;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <ApperIcon name={config.icon} className="h-3 w-3" />
        <span>{status}</span>
      </Badge>
    );
  };

  const getGradeLevelColor = (grade) => {
    if (grade <= 5) return "from-blue-500 to-blue-600";
    if (grade <= 8) return "from-green-500 to-green-600";
    return "from-purple-500 to-purple-600";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-surface to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 font-display">
                Student
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 font-display">
                Grade Level
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 font-display">
                Contact Info
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 font-display">
                Enrollment
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 font-display">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 font-display">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student, index) => (
              <tr 
                key={student.Id} 
                className="hover:bg-gradient-to-r hover:from-surface hover:to-gray-50 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center text-white font-semibold shadow-md"
                      style={{ backgroundImage: `linear-gradient(135deg, ${getGradeLevelColor(student.gradeLevel)})` }}
                    >
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">ID: {student.Id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getGradeLevelColor(student.gradeLevel)} flex items-center justify-center shadow-md`}>
                      <span className="text-white text-sm font-bold">{student.gradeLevel}</span>
                    </div>
                    <span className="text-sm text-gray-600">Grade {student.gradeLevel}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ApperIcon name="Mail" className="h-4 w-4" />
                      <span>{student.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ApperIcon name="Phone" className="h-4 w-4" />
                      <span>{student.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-gray-900 font-medium">
                      {format(new Date(student.enrollmentDate), "MMM dd, yyyy")}
                    </p>
                    <p className="text-gray-600">
                      {Math.floor((new Date() - new Date(student.enrollmentDate)) / (1000 * 60 * 60 * 24))} days ago
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(student.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(student)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(student.Id)}
                      className="hover:bg-error/10 hover:text-error"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;