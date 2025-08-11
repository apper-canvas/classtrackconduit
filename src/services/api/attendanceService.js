import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll() {
    await this.delay();
    return [...this.attendance];
  }

  async getByDate(date) {
    await this.delay();
    const dateStr = typeof date === "string" ? date : date.toISOString().split("T")[0];
    return this.attendance.filter(att => att.date === dateStr);
  }

  async getByStudent(studentId, dateRange = null) {
    await this.delay();
    let records = this.attendance.filter(att => att.studentId === studentId);
    
    if (dateRange && dateRange.start && dateRange.end) {
      records = records.filter(att => 
        att.date >= dateRange.start && att.date <= dateRange.end
      );
    }
    
    return records;
  }

  async markAttendance(studentId, classId, date, status, notes = "") {
    await this.delay();
    const dateStr = typeof date === "string" ? date : date.toISOString().split("T")[0];
    
    // Check if attendance already exists for this student, class, and date
    const existingIndex = this.attendance.findIndex(att => 
      att.studentId === studentId && 
      att.classId === classId && 
      att.date === dateStr
    );

    if (existingIndex !== -1) {
      // Update existing record
      this.attendance[existingIndex] = {
        ...this.attendance[existingIndex],
        status,
        notes
      };
      return { ...this.attendance[existingIndex] };
    } else {
      // Create new record
      const highestId = Math.max(...this.attendance.map(a => a.Id), 0);
      const newAttendance = {
        Id: highestId + 1,
        studentId: studentId,
        classId: classId,
        date: dateStr,
        status,
        notes
      };
      this.attendance.push(newAttendance);
      return { ...newAttendance };
    }
  }

  async getAttendanceStats(dateRange = null) {
    await this.delay();
    let records = [...this.attendance];
    
    if (dateRange && dateRange.start && dateRange.end) {
      records = records.filter(att => 
        att.date >= dateRange.start && att.date <= dateRange.end
      );
    }

    const stats = {
      total: records.length,
      present: records.filter(att => att.status === "Present").length,
      absent: records.filter(att => att.status === "Absent").length,
      late: records.filter(att => att.status === "Late").length,
      excused: records.filter(att => att.status === "Excused").length
    };

    stats.presentPercentage = records.length > 0 ? Math.round((stats.present / records.length) * 100) : 0;

    return stats;
  }

  async delete(id) {
    await this.delay();
    const index = this.attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Attendance record with ID ${id} not found`);
    }
    const deleted = this.attendance.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new AttendanceService();