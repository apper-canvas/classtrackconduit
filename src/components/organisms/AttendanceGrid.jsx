import React from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AttendanceGrid = ({ students, attendance, onMarkAttendance, selectedDate }) => {
  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(
      (att) => att.studentId === studentId && att.date === format(selectedDate, "yyyy-MM-dd")
    );
    return record?.status || "unmarked";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Present: { variant: "success", icon: "CheckCircle" },
      Absent: { variant: "error", icon: "XCircle" },
      Late: { variant: "warning", icon: "Clock" },
      Excused: { variant: "info", icon: "AlertCircle" },
      unmarked: { variant: "default", icon: "Minus" }
    };

    const config = statusConfig[status] || statusConfig.unmarked;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1 min-w-[90px] justify-center">
        <ApperIcon name={config.icon} className="h-3 w-3" />
        <span className="capitalize">{status === "unmarked" ? "Not Set" : status}</span>
      </Badge>
    );
  };

  const handleQuickMark = (studentId, status) => {
    onMarkAttendance(studentId, status);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-surface to-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Daily Attendance
            </h3>
            <p className="text-sm text-gray-600">
              {format(selectedDate, "EEEE, MMMM do, yyyy")}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Quick Actions</p>
              <div className="flex items-center space-x-2 mt-1">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => {
                    students.forEach(student => handleQuickMark(student.Id, "Present"));
                  }}
                  className="text-xs"
                >
                  Mark All Present
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 font-display">
                Student
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 font-display">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 font-display">
                Quick Mark
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student, index) => {
              const status = getAttendanceStatus(student.Id);
              return (
                <tr 
                  key={student.Id}
                  className="hover:bg-gradient-to-r hover:from-surface hover:to-gray-50 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-600">Grade {student.gradeLevel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant={status === "Present" ? "success" : "outline"}
                        onClick={() => handleQuickMark(student.Id, "Present")}
                        className="text-xs min-w-[70px]"
                      >
                        <ApperIcon name="CheckCircle" className="h-3 w-3 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={status === "Absent" ? "error" : "outline"}
                        onClick={() => handleQuickMark(student.Id, "Absent")}
                        className="text-xs min-w-[70px]"
                      >
                        <ApperIcon name="XCircle" className="h-3 w-3 mr-1" />
                        Absent
                      </Button>
                      <Button
                        size="sm"
                        variant={status === "Late" ? "warning" : "outline"}
                        onClick={() => handleQuickMark(student.Id, "Late")}
                        className="text-xs min-w-[70px]"
                      >
                        <ApperIcon name="Clock" className="h-3 w-3 mr-1" />
                        Late
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceGrid;