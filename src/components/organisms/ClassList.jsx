import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ClassList = ({ classes, students, onEdit, onDelete }) => {
  const getStudentCount = (studentIds) => {
    return studentIds?.length || 0;
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: "from-blue-500 to-blue-600",
      Science: "from-green-500 to-green-600",
      English: "from-purple-500 to-purple-600",
      History: "from-orange-500 to-orange-600",
      Art: "from-pink-500 to-pink-600",
      "Physical Education": "from-red-500 to-red-600"
    };
    return colors[subject] || "from-gray-500 to-gray-600";
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      Mathematics: "Calculator",
      Science: "Microscope",
      English: "BookOpen",
      History: "Clock",
      Art: "Palette",
      "Physical Education": "Activity"
    };
    return icons[subject] || "Book";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem, index) => (
        <Card 
          key={classItem.Id} 
          className="overflow-hidden animate-scale-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-0">
            <div className={`h-32 bg-gradient-to-br ${getSubjectColor(classItem.subject)} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute top-4 left-4 text-white">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-2 backdrop-blur-sm">
                  <ApperIcon name={getSubjectIcon(classItem.subject)} className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold font-display">{classItem.name}</h3>
                <p className="text-sm opacity-90">{classItem.subject}</p>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="default" className="bg-white bg-opacity-20 text-white border-white border-opacity-30 backdrop-blur-sm">
                  Period {classItem.period}
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="MapPin" className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Room {classItem.room}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Users" className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {getStudentCount(classItem.studentIds)} students
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(classItem)}
                      className="flex-1 mr-2"
                    >
                      <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(classItem.Id)}
                      className="text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClassList;