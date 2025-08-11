class AttendanceService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'attendance_c';
    this.lookupFields = ['student_id_c', 'class_id_c'];
  }

  prepareLookupFields(data) {
    const prepared = {...data};
    this.lookupFields.forEach(fieldName => {
      if (prepared[fieldName] !== undefined && prepared[fieldName] !== null) {
        prepared[fieldName] = prepared[fieldName]?.Id || prepared[fieldName];
      }
    });
    return prepared;
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance:", error.message);
        throw error;
      }
    }
  }

  async getByDate(date) {
    try {
      const dateStr = typeof date === "string" ? date : date.toISOString().split("T")[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "student_id_c" } },
          { field: { Name: "class_id_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [dateStr],
            Include: true
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance by date:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching attendance by date:", error.message);
        throw error;
      }
    }
  }

  async markAttendance(studentId, classId, date, status, notes = "") {
    try {
      const dateStr = typeof date === "string" ? date : date.toISOString().split("T")[0];
      
      // First check if record exists
      const existingParams = {
        fields: [{ field: { Name: "Id" } }],
        where: [
          { FieldName: "student_id_c", Operator: "EqualTo", Values: [parseInt(studentId)] },
          { FieldName: "class_id_c", Operator: "EqualTo", Values: [parseInt(classId)] },
          { FieldName: "date_c", Operator: "EqualTo", Values: [dateStr] }
        ]
      };

      const existingResponse = await this.apperClient.fetchRecords(this.tableName, existingParams);
      
      if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
        // Update existing record
        const recordId = existingResponse.data[0].Id;
        const updateParams = {
          records: [{
            Id: recordId,
            status_c: status,
            notes_c: notes || ""
          }]
        };

        const updateResponse = await this.apperClient.updateRecord(this.tableName, updateParams);
        if (!updateResponse.success) {
          throw new Error(updateResponse.message);
        }
        
        return updateResponse.results?.[0]?.data;
      } else {
        // Create new record
        const createParams = {
          records: [{
            Name: `${dateStr} - Student ${studentId}`,
            student_id_c: parseInt(studentId),
            class_id_c: parseInt(classId),
            date_c: dateStr,
            status_c: status,
            notes_c: notes || ""
          }]
        };

        const createResponse = await this.apperClient.createRecord(this.tableName, createParams);
        if (!createResponse.success) {
          throw new Error(createResponse.message);
        }
        
        return createResponse.results?.[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking attendance:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error marking attendance:", error.message);
        throw error;
      }
    }
  }

  async getAttendanceStats(dateRange = null) {
    try {
      let params = {
        fields: [
          { field: { Name: "status_c" } },
          { field: { Name: "date_c" } }
        ]
      };

      if (dateRange && dateRange.start && dateRange.end) {
        params.where = [
          { FieldName: "date_c", Operator: "GreaterThanOrEqualTo", Values: [dateRange.start] },
          { FieldName: "date_c", Operator: "LessThanOrEqualTo", Values: [dateRange.end] }
        ];
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const records = response.data || [];
      
      const stats = {
        total: records.length,
        present: records.filter(att => att.status_c === "Present").length,
        absent: records.filter(att => att.status_c === "Absent").length,
        late: records.filter(att => att.status_c === "Late").length,
        excused: records.filter(att => att.status_c === "Excused").length
      };

      stats.presentPercentage = records.length > 0 ? Math.round((stats.present / records.length) * 100) : 0;

      return stats;
    } catch (error) {
      console.error("Error getting attendance stats:", error.message);
      return { total: 0, present: 0, absent: 0, late: 0, excused: 0, presentPercentage: 0 };
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.results?.[0]?.success || false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting attendance:", error.message);
        throw error;
      }
    }
  }
}
export default new AttendanceService();