import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll() {
    await this.delay();
    return [...this.grades];
  }

  async getById(id) {
    await this.delay();
    const grade = this.grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error(`Grade with ID ${id} not found`);
    }
    return { ...grade };
  }

  async getByStudent(studentId) {
    await this.delay();
    return this.grades.filter(grade => grade.studentId === studentId);
  }

  async getByClass(classId) {
    await this.delay();
    return this.grades.filter(grade => grade.classId === classId);
  }

  async create(gradeData) {
    await this.delay();
    const highestId = Math.max(...this.grades.map(g => g.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: highestId + 1,
      date: gradeData.date || new Date().toISOString().split("T")[0]
    };
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await this.delay();
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Grade with ID ${id} not found`);
    }
    this.grades[index] = { ...this.grades[index], ...gradeData };
    return { ...this.grades[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Grade with ID ${id} not found`);
    }
    const deletedGrade = this.grades.splice(index, 1)[0];
    return { ...deletedGrade };
  }

  async getClassAverages(classId) {
    await this.delay();
    const classGrades = this.grades.filter(grade => grade.classId === classId);
    
    if (classGrades.length === 0) return 0;
    
    const totalPercentage = classGrades.reduce((sum, grade) => {
      return sum + (grade.score / grade.totalPoints) * 100;
    }, 0);
    
    return Math.round(totalPercentage / classGrades.length);
  }

  async getStudentAverage(studentId) {
    await this.delay();
    const studentGrades = this.grades.filter(grade => grade.studentId === studentId);
    
    if (studentGrades.length === 0) return 0;
    
    const totalPercentage = studentGrades.reduce((sum, grade) => {
      return sum + (grade.score / grade.totalPoints) * 100;
    }, 0);
    
    return Math.round(totalPercentage / studentGrades.length);
  }

  async getRecentGrades(limit = 10) {
    await this.delay();
    return [...this.grades]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }
}

export default new GradeService();