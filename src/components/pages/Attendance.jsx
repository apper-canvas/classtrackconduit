import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";
import { format, subDays, addDays } from "date-fns";
import { toast } from "react-toastify";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceStats, setAttendanceStats] = useState({});

  const loadData = async (date = selectedDate) => {
    try {
      setError("");
      setLoading(true);
      
      const dateStr = format(date, "yyyy-MM-dd");
      const [studentsData, attendanceData, stats] = await Promise.all([
        studentService.getAll(),
        attendanceService.getByDate(dateStr),
        attendanceService.getAttendanceStats({ start: dateStr, end: dateStr })
      ]);
      
      // Filter active students only
      const activeStudents = studentsData.filter(student => student.status === "Active");
      
      setStudents(activeStudents);
      setAttendance(attendanceData);
      setAttendanceStats(stats);
    } catch (err) {
      console.error("Error loading attendance data:", err);
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handleMarkAttendance = async (studentId, status) => {
    try {
      await attendanceService.markAttendance(
        studentId.toString(),
        "1", // Default class ID for demo
        selectedDate,
        status
      );
      
      toast.success(`Marked ${status.toLowerCase()}`);
      loadData(selectedDate);
    } catch (err) {
      console.error("Error marking attendance:", err);
      toast.error(err.message || "Failed to mark attendance");
    }
  };

  const handleDateChange = (days) => {
    const newDate = days > 0 ? addDays(selectedDate, days) : subDays(selectedDate, Math.abs(days));
    setSelectedDate(newDate);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  const getAttendanceCount = (status) => {
    return attendance.filter(att => att.status === status).length;
  };

  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  if (loading) {
    return <Loading type="table" message="Loading attendance data..." />;
  }

  if (error) {
    return <Error message={error} onRetry={() => loadData()} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Attendance Tracking
          </h1>
          <p className="text-gray-600 mt-1">
            Track daily attendance for all your students
          </p>
        </div>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDateChange(-1)}
              >
                <ApperIcon name="ChevronLeft" className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900 font-display">
                  {format(selectedDate, "EEEE, MMMM do")}
                </h2>
                <p className="text-sm text-gray-600">
                  {format(selectedDate, "yyyy")}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDateChange(1)}
              >
                <ApperIcon name="ChevronRight" className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isToday && (
                <Button variant="outline" size="sm" onClick={handleTodayClick}>
                  <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                  Today
                </Button>
              )}
              <div className="text-right text-sm text-gray-600">
                <p>{students.length} students</p>
                <p>{attendance.length} marked</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-success/10 to-success/20 border border-success/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-success to-success/90 rounded-full flex items-center justify-center shadow-md">
              <ApperIcon name="CheckCircle" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-success">{getAttendanceCount("Present")}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-error/10 to-error/20 border border-error/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-error to-error/90 rounded-full flex items-center justify-center shadow-md">
              <ApperIcon name="XCircle" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-error">{getAttendanceCount("Absent")}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-warning/10 to-warning/20 border border-warning/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-warning to-warning/90 rounded-full flex items-center justify-center shadow-md">
              <ApperIcon name="Clock" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-warning">{getAttendanceCount("Late")}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-info/10 to-info/20 border border-info/20 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-info to-info/90 rounded-full flex items-center justify-center shadow-md">
              <ApperIcon name="AlertCircle" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Excused</p>
              <p className="text-2xl font-bold text-info">{getAttendanceCount("Excused")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Grid */}
      {students.length === 0 ? (
        <Empty
          type="students"
          title="No active students"
          description="Add some students to your roster before taking attendance."
        />
      ) : (
        <AttendanceGrid
          students={students}
          attendance={attendance}
          selectedDate={selectedDate}
          onMarkAttendance={handleMarkAttendance}
        />
      )}
    </div>
  );
};

export default Attendance;