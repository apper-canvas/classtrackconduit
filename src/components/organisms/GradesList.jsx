import React from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const GradesList = ({ grades, students, onEdit, onDelete }) => {
  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getGradeColor = (score, totalPoints) => {
    const percentage = (score / totalPoints) * 100;
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "primary";
    if (percentage >= 70) return "warning";
    return "error";
  };

  const getTypeIcon = (type) => {
    const types = {
      Test: "FileText",
      Quiz: "HelpCircle",
      Assignment: "BookOpen",
      Project: "Briefcase",
      Homework: "Home"
    };
    return types[type] || "FileText";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-surface to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 font-display">
                Assignment
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 font-display">
                Student
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 font-display">
                Score
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 font-display">
                Grade
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 font-display">
                Date
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 font-display">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {grades.map((grade, index) => {
              const percentage = Math.round((grade.score / grade.totalPoints) * 100);
              const gradeColor = getGradeColor(grade.score, grade.totalPoints);
              
              return (
                <tr 
                  key={grade.Id}
                  className="hover:bg-gradient-to-r hover:from-surface hover:to-gray-50 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-secondary to-secondary/90 rounded-lg flex items-center justify-center shadow-md">
                        <ApperIcon name={getTypeIcon(grade.type)} className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{grade.assignmentName}</p>
                        <Badge variant="secondary" className="mt-1">
                          <ApperIcon name={getTypeIcon(grade.type)} className="h-3 w-3 mr-1" />
                          {grade.type}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{getStudentName(grade.studentId)}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        {grade.score}
                      </span>
                      <span className="text-gray-500">/ {grade.totalPoints}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={gradeColor} className="text-sm font-semibold">
                      {percentage}%
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {format(new Date(grade.date), "MMM dd, yyyy")}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(grade)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(grade.Id)}
                        className="hover:bg-error/10 hover:text-error"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
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

export default GradesList;