import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";
import gradeService from "@/services/api/gradeService";
import classService from "@/services/api/classService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [data, setData] = useState({
    students: [],
    classes: [],
    todayAttendance: [],
    recentGrades: [],
    attendanceStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);

      const today = new Date().toISOString().split("T")[0];
      
      const [students, classes, todayAttendance, recentGrades, attendanceStats] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        attendanceService.getByDate(today),
        gradeService.getRecentGrades(5),
        attendanceService.getAttendanceStats({
          start: today,
          end: today
        })
      ]);

      setData({
        students,
        classes,
        todayAttendance,
        recentGrades,
        attendanceStats
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleQuickAttendance = async () => {
    try {
      // This would navigate to attendance page in a real app
      toast.info("Redirecting to attendance page...");
    } catch (err) {
      toast.error("Failed to open attendance");
    }
  };

  const getAttendanceRate = () => {
    if (data.attendanceStats.total === 0) return 0;
    return data.attendanceStats.presentPercentage;
  };

  const getAverageGrade = () => {
    if (data.recentGrades.length === 0) return 0;
    const average = data.recentGrades.reduce((sum, grade) => {
      return sum + (grade.score / grade.totalPoints) * 100;
    }, 0) / data.recentGrades.length;
    return Math.round(average);
  };

  const getTodayStats = () => {
    const total = data.students.length;
    const present = data.todayAttendance.filter(att => att.status === "Present").length;
    const absent = data.todayAttendance.filter(att => att.status === "Absent").length;
    const late = data.todayAttendance.filter(att => att.status === "Late").length;
    
    return { total, present, absent, late };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="stats" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Loading />
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const todayStats = getTodayStats();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening in your classroom today.
          </p>
        </div>
        <Button onClick={handleQuickAttendance} className="hidden sm:flex">
          <ApperIcon name="Users" className="h-4 w-4 mr-2" />
          Take Attendance
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={data.students.length}
          icon="Users"
          change={`${data.students.filter(s => s.status === "Active").length} active`}
          changeType="neutral"
          gradient="from-primary to-primary/90"
        />
        <StatCard
          title="Classes"
          value={data.classes.length}
          icon="School"
          change="All active"
          changeType="positive"
          gradient="from-secondary to-secondary/90"
        />
        <StatCard
          title="Today's Attendance"
          value={`${getAttendanceRate()}%`}
          icon="Calendar"
          change={`${todayStats.present}/${todayStats.total} present`}
          changeType={getAttendanceRate() >= 90 ? "positive" : "neutral"}
          gradient="from-success to-success/90"
        />
        <StatCard
          title="Average Grade"
          value={`${getAverageGrade()}%`}
          icon="BookOpen"
          change="Recent assignments"
          changeType={getAverageGrade() >= 85 ? "positive" : "neutral"}
          gradient="from-accent to-accent/90"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Calendar" className="h-5 w-5 text-primary" />
              <span>Today's Attendance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-success/10 to-success/20 rounded-lg border border-success/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-success to-success/90 rounded-full flex items-center justify-center shadow-md">
                    <ApperIcon name="CheckCircle" className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-success">Present</p>
                    <p className="text-sm text-gray-600">{todayStats.present} students</p>
                  </div>
                </div>
                <Badge variant="success" className="text-lg font-bold px-4 py-2">
                  {todayStats.present}
                </Badge>
              </div>

              {todayStats.absent > 0 && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-error/10 to-error/20 rounded-lg border border-error/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-error to-error/90 rounded-full flex items-center justify-center shadow-md">
                      <ApperIcon name="XCircle" className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-error">Absent</p>
                      <p className="text-sm text-gray-600">{todayStats.absent} students</p>
                    </div>
                  </div>
                  <Badge variant="error" className="text-lg font-bold px-4 py-2">
                    {todayStats.absent}
                  </Badge>
                </div>
              )}

              {todayStats.late > 0 && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-warning/10 to-warning/20 rounded-lg border border-warning/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-warning to-warning/90 rounded-full flex items-center justify-center shadow-md">
                      <ApperIcon name="Clock" className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-warning">Late</p>
                      <p className="text-sm text-gray-600">{todayStats.late} students</p>
                    </div>
                  </div>
                  <Badge variant="warning" className="text-lg font-bold px-4 py-2">
                    {todayStats.late}
                  </Badge>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button onClick={handleQuickAttendance} className="w-full">
                  <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                  Take Attendance Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BookOpen" className="h-5 w-5 text-secondary" />
              <span>Recent Grades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentGrades.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="BookOpen" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent grades</p>
                <p className="text-sm text-gray-500">Start recording student performance</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentGrades.map((grade) => {
                  const percentage = Math.round((grade.score / grade.totalPoints) * 100);
                  const gradeColor = percentage >= 90 ? "success" : percentage >= 80 ? "primary" : percentage >= 70 ? "warning" : "error";
                  
                  return (
                    <div key={grade.Id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-surface transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{grade.assignmentName}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(grade.date), "MMM dd")} • {grade.type}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {grade.score}/{grade.totalPoints}
                          </p>
                        </div>
                        <Badge variant={gradeColor} className="font-semibold">
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Add New Grade
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Zap" className="h-5 w-5 text-accent" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ApperIcon name="UserPlus" className="h-6 w-6" />
              <span>Add Student</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ApperIcon name="Calendar" className="h-6 w-6" />
              <span>Take Attendance</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ApperIcon name="Plus" className="h-6 w-6" />
              <span>Record Grade</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ApperIcon name="School" className="h-6 w-6" />
              <span>Create Class</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;