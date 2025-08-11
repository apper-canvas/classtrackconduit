import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FormField from "@/components/molecules/FormField";
import GradesList from "@/components/organisms/GradesList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import gradeService from "@/services/api/gradeService";
import studentService from "@/services/api/studentService";
import classService from "@/services/api/classService";
import { toast } from "react-toastify";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
    assignmentName: "",
    score: "",
    totalPoints: "",
    type: "",
    date: ""
  });

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [gradesData, studentsData, classesData] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ]);
      
      setGrades(gradesData);
      setStudents(studentsData);
      setClasses(classesData);
      setFilteredGrades(gradesData);
    } catch (err) {
      console.error("Error loading grades data:", err);
      setError(err.message || "Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredGrades(grades);
    } else {
      const filtered = grades.filter(grade => {
        const student = students.find(s => s.Id === grade.studentId);
        const studentName = student ? `${student.firstName} ${student.lastName}` : "";
        
        return (
          grade.assignmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grade.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredGrades(filtered);
    }
  }, [searchQuery, grades, students]);

  const resetForm = () => {
    setFormData({
      studentId: "",
      classId: "",
      assignmentName: "",
      score: "",
      totalPoints: "",
      type: "",
      date: new Date().toISOString().split("T")[0]
    });
    setEditingGrade(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.assignmentName || !formData.score || !formData.totalPoints) {
      toast.error("Please fill in all required fields");
      return;
    }

    const score = parseFloat(formData.score);
    const totalPoints = parseFloat(formData.totalPoints);
    
    if (isNaN(score) || isNaN(totalPoints) || score < 0 || totalPoints <= 0) {
      toast.error("Please enter valid score values");
      return;
    }

    if (score > totalPoints) {
      toast.error("Score cannot be greater than total points");
      return;
    }

    try {
      const gradeData = {
        ...formData,
        score: score,
        totalPoints: totalPoints,
        classId: formData.classId || "1", // Default class for demo
        date: formData.date || new Date().toISOString().split("T")[0]
      };

      if (editingGrade) {
        await gradeService.update(editingGrade.Id, gradeData);
        toast.success("Grade updated successfully!");
      } else {
        await gradeService.create(gradeData);
        toast.success("Grade added successfully!");
      }
      
      resetForm();
      loadData();
    } catch (err) {
      console.error("Error saving grade:", err);
      toast.error(err.message || "Failed to save grade");
    }
  };

  const handleEdit = (grade) => {
    setFormData({
      studentId: grade.studentId,
      classId: grade.classId,
      assignmentName: grade.assignmentName,
      score: grade.score.toString(),
      totalPoints: grade.totalPoints.toString(),
      type: grade.type,
      date: grade.date
    });
    setEditingGrade(grade);
    setShowAddForm(true);
  };

  const handleDelete = async (gradeId) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) {
      return;
    }

    try {
      await gradeService.delete(gradeId);
      toast.success("Grade deleted successfully!");
      loadData();
    } catch (err) {
      console.error("Error deleting grade:", err);
      toast.error(err.message || "Failed to delete grade");
    }
  };

  const studentOptions = students.map(student => ({
    value: student.Id.toString(),
    label: `${student.firstName} ${student.lastName} (Grade ${student.gradeLevel})`
  }));

  const classOptions = classes.map(classItem => ({
    value: classItem.Id,
    label: `${classItem.name} - ${classItem.subject}`
  }));

  const typeOptions = [
    { value: "Test", label: "Test" },
    { value: "Quiz", label: "Quiz" },
    { value: "Assignment", label: "Assignment" },
    { value: "Project", label: "Project" },
    { value: "Homework", label: "Homework" }
  ];

  if (loading) {
    return <Loading type="table" message="Loading grades..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const averageGrade = filteredGrades.length > 0 
    ? Math.round(filteredGrades.reduce((sum, grade) => sum + (grade.score / grade.totalPoints) * 100, 0) / filteredGrades.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Grade Management
          </h1>
          <p className="text-gray-600 mt-1">
            Record and track student performance across assignments
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Grade
        </Button>
      </div>

      {/* Stats and Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by assignment, student name, or type..."
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/20 rounded-xl p-4 text-center min-w-[120px]">
            <p className="text-sm text-gray-600">Total Grades</p>
            <p className="text-2xl font-bold text-primary">{filteredGrades.length}</p>
          </div>
          
          <div className="bg-gradient-to-r from-accent/10 to-accent/20 border border-accent/20 rounded-xl p-4 text-center min-w-[120px]">
            <p className="text-sm text-gray-600">Class Average</p>
            <p className="text-2xl font-bold text-accent">{averageGrade}%</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name={editingGrade ? "Edit" : "Plus"} className="h-5 w-5 text-primary" />
                <span>{editingGrade ? "Edit Grade" : "Add New Grade"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Student"
                type="select"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                options={studentOptions}
                required
              />
              
              <FormField
                label="Class"
                type="select"
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                options={classOptions}
              />
              
              <FormField
                label="Assignment Name"
                value={formData.assignmentName}
                onChange={(e) => setFormData({ ...formData, assignmentName: e.target.value })}
                required
              />
              
              <FormField
                label="Assignment Type"
                type="select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={typeOptions}
                required
              />
              
              <FormField
                label="Score Earned"
                type="number"
                min="0"
                step="0.01"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                required
              />
              
              <FormField
                label="Total Points"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.totalPoints}
                onChange={(e) => setFormData({ ...formData, totalPoints: e.target.value })}
                required
              />
              
              <FormField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="md:col-span-2"
              />
              
              {formData.score && formData.totalPoints && (
                <div className="md:col-span-2 p-4 bg-gradient-to-r from-info/10 to-info/20 rounded-lg border border-info/20">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Calculator" className="h-5 w-5 text-info" />
                    <span className="text-info font-medium">
                      Grade Preview: {Math.round((parseFloat(formData.score) / parseFloat(formData.totalPoints)) * 100)}%
                    </span>
                  </div>
                </div>
              )}
              
              <div className="md:col-span-2 flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  <ApperIcon name={editingGrade ? "Save" : "Plus"} className="h-4 w-4 mr-2" />
                  {editingGrade ? "Update Grade" : "Add Grade"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Grades List */}
      {filteredGrades.length === 0 ? (
        <Empty
          type="grades"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <GradesList
          grades={filteredGrades}
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Grades;