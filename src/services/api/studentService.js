import studentsData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll() {
    await this.delay();
    return [...this.students];
  }

  async getById(id) {
    await this.delay();
    const student = this.students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error(`Student with ID ${id} not found`);
    }
    return { ...student };
  }

  async create(studentData) {
    await this.delay();
    const highestId = Math.max(...this.students.map(s => s.Id), 0);
    const newStudent = {
      ...studentData,
      Id: highestId + 1,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "Active"
    };
    this.students.push(newStudent);
    return { ...newStudent };
  }

  async update(id, studentData) {
    await this.delay();
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Student with ID ${id} not found`);
    }
    this.students[index] = { ...this.students[index], ...studentData };
    return { ...this.students[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Student with ID ${id} not found`);
    }
    const deletedStudent = this.students.splice(index, 1)[0];
    return { ...deletedStudent };
  }

  async search(query) {
    await this.delay();
    if (!query) return [...this.students];
    
    const lowercaseQuery = query.toLowerCase();
    return this.students.filter(student => 
      student.firstName.toLowerCase().includes(lowercaseQuery) ||
      student.lastName.toLowerCase().includes(lowercaseQuery) ||
      student.email.toLowerCase().includes(lowercaseQuery) ||
      student.Id.toString().includes(query)
    );
  }

  async getByClass(classId) {
    await this.delay();
    return this.students.filter(student => 
      student.classIds.includes(classId)
    );
  }
}

export default new StudentService();