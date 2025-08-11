import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FormField from "@/components/molecules/FormField";
import ClassList from "@/components/organisms/ClassList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import classService from "@/services/api/classService";
import studentService from "@/services/api/studentService";
import { toast } from "react-toastify";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    period: "",
    room: "",
    studentIds: []
  });

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [classesData, studentsData] = await Promise.all([
        classService.getAll(),
        studentService.getAll()
      ]);
      
      setClasses(classesData);
      setStudents(studentsData);
      setFilteredClasses(classesData);
    } catch (err) {
      console.error("Error loading classes data:", err);
      setError(err.message || "Failed to load classes data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredClasses(classes);
    } else {
      const filtered = classes.filter(classItem =>
        classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classItem.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classItem.room.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClasses(filtered);
    }
  }, [searchQuery, classes]);

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      period: "",
      room: "",
      studentIds: []
    });
    setEditingClass(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.subject || !formData.period || !formData.room) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const classData = {
        ...formData,
        studentIds: formData.studentIds || []
      };

      if (editingClass) {
        await classService.update(editingClass.Id, classData);
        toast.success("Class updated successfully!");
      } else {
        await classService.create(classData);
        toast.success("Class created successfully!");
      }
      
      resetForm();
      loadData();
    } catch (err) {
      console.error("Error saving class:", err);
      toast.error(err.message || "Failed to save class");
    }
  };

  const handleEdit = (classItem) => {
    setFormData({
      name: classItem.name,
      subject: classItem.subject,
      period: classItem.period,
      room: classItem.room,
      studentIds: classItem.studentIds || []
    });
    setEditingClass(classItem);
    setShowAddForm(true);
  };

  const handleDelete = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) {
      return;
    }

    try {
      await classService.delete(classId);
      toast.success("Class deleted successfully!");
      loadData();
    } catch (err) {
      console.error("Error deleting class:", err);
      toast.error(err.message || "Failed to delete class");
    }
  };

  const subjectOptions = [
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "English", label: "English" },
    { value: "History", label: "History" },
    { value: "Art", label: "Art" },
    { value: "Physical Education", label: "Physical Education" },
    { value: "Music", label: "Music" },
    { value: "Computer Science", label: "Computer Science" }
  ];

  const periodOptions = [
    { value: "1", label: "Period 1" },
    { value: "2", label: "Period 2" },
    { value: "3", label: "Period 3" },
    { value: "4", label: "Period 4" },
    { value: "5", label: "Period 5" },
    { value: "6", label: "Period 6" },
    { value: "7", label: "Period 7" },
    { value: "8", label: "Period 8" }
  ];

  if (loading) {
    return <Loading type="cards" message="Loading classes..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const totalEnrollment = classes.reduce((total, classItem) => total + (classItem.studentIds?.length || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Class Management
          </h1>
          <p className="text-gray-600 mt-1">
            Organize and manage your classes and student enrollments
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </div>

      {/* Stats and Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classes by name, subject, or room..."
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/20 rounded-xl p-4 text-center min-w-[120px]">
            <p className="text-sm text-gray-600">Total Classes</p>
            <p className="text-2xl font-bold text-primary">{filteredClasses.length}</p>
          </div>
          
          <div className="bg-gradient-to-r from-secondary/10 to-secondary/20 border border-secondary/20 rounded-xl p-4 text-center min-w-[120px]">
            <p className="text-sm text-gray-600">Enrollments</p>
            <p className="text-2xl font-bold text-secondary">{totalEnrollment}</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name={editingClass ? "Edit" : "Plus"} className="h-5 w-5 text-primary" />
                <span>{editingClass ? "Edit Class" : "Create New Class"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Class Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Algebra II, Biology, World History"
                required
              />
              
              <FormField
                label="Subject"
                type="select"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                options={subjectOptions}
                required
              />
              
              <FormField
                label="Period"
                type="select"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                options={periodOptions}
                required
              />
              
              <FormField
                label="Room Number"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g., 101, A205, Lab-3"
                required
              />
              
              <div className="md:col-span-2 flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  <ApperIcon name={editingClass ? "Save" : "Plus"} className="h-4 w-4 mr-2" />
                  {editingClass ? "Update Class" : "Create Class"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Classes List */}
      {filteredClasses.length === 0 ? (
        <Empty
          type="classes"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <ClassList
          classes={filteredClasses}
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Classes;