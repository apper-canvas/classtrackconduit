import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FormField from "@/components/molecules/FormField";
import StudentTable from "@/components/organisms/StudentTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import studentService from "@/services/api/studentService";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    grade_level_c: "",
    email_c: "",
    phone_c: "",
    classIds: []
  });

  const loadStudents = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error("Error loading students:", err);
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredStudents(students);
    } else {
const filtered = students.filter(student =>
        student.first_name_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.last_name_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.Id.toString().includes(searchQuery)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

const resetForm = () => {
    setFormData({
      first_name_c: "",
      last_name_c: "",
      grade_level_c: "",
      email_c: "",
      phone_c: "",
      classIds: []
    });
    setEditingStudent(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
if (!formData.first_name_c || !formData.last_name_c || !formData.grade_level_c || !formData.email_c) {
      toast.error("Please fill in all required fields");
      return;
    }

try {
      const studentData = {
        first_name_c: formData.first_name_c,
        last_name_c: formData.last_name_c,
        grade_level_c: formData.grade_level_c,
        email_c: formData.email_c,
        phone_c: formData.phone_c,
        status_c: "Active",
        enrollment_date_c: new Date().toISOString().split("T")[0]
      };

      if (editingStudent) {
        await studentService.update(editingStudent.Id, studentData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(studentData);
        toast.success("Student added successfully!");
      }
      
      resetForm();
      loadStudents();
    } catch (err) {
      console.error("Error saving student:", err);
      toast.error(err.message || "Failed to save student");
    }
  };

const handleEdit = (student) => {
    setFormData({
      first_name_c: student.first_name_c,
      last_name_c: student.last_name_c,
      grade_level_c: student.grade_level_c?.toString(),
      email_c: student.email_c,
      phone_c: student.phone_c,
      classIds: student.classIds || []
    });
    setEditingStudent(student);
    setShowAddForm(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await studentService.delete(studentId);
      toast.success("Student deleted successfully!");
      loadStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      toast.error(err.message || "Failed to delete student");
    }
  };

  const gradeOptions = [
    { value: "9", label: "Grade 9" },
    { value: "10", label: "Grade 10" },
    { value: "11", label: "Grade 11" },
    { value: "12", label: "Grade 12" }
  ];

  if (loading) {
    return <Loading type="table" message="Loading students..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStudents} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your student roster and track their information
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, email, or ID..."
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gradient-to-r from-surface to-gray-100 px-4 py-2 rounded-lg border border-gray-200">
          <ApperIcon name="Users" className="h-4 w-4" />
          <span>{filteredStudents.length} students</span>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name={editingStudent ? "Edit" : "UserPlus"} className="h-5 w-5 text-primary" />
                <span>{editingStudent ? "Edit Student" : "Add New Student"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
                label="First Name"
                value={formData.first_name_c}
                onChange={(e) => setFormData({ ...formData, first_name_c: e.target.value })}
                required
              />
              
<FormField
                label="Last Name"
                value={formData.last_name_c}
                onChange={(e) => setFormData({ ...formData, last_name_c: e.target.value })}
                required
              />
              
<FormField
                label="Grade Level"
                type="select"
                value={formData.grade_level_c}
                onChange={(e) => setFormData({ ...formData, grade_level_c: e.target.value })}
                options={gradeOptions}
                required
              />
              
<FormField
                label="Email Address"
                type="email"
                value={formData.email_c}
                onChange={(e) => setFormData({ ...formData, email_c: e.target.value })}
                required
              />
              
<FormField
                label="Phone Number"
                type="tel"
                value={formData.phone_c}
                onChange={(e) => setFormData({ ...formData, phone_c: e.target.value })}
                className="md:col-span-2"
              />
              
              <div className="md:col-span-2 flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  <ApperIcon name={editingStudent ? "Save" : "Plus"} className="h-4 w-4 mr-2" />
                  {editingStudent ? "Update Student" : "Add Student"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Student List */}
      {filteredStudents.length === 0 ? (
        <Empty
          type="students"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Students;