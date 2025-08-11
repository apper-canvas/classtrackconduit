import classesData from "@/services/mockData/classes.json";

class ClassService {
  constructor() {
    this.classes = [...classesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll() {
    await this.delay();
    return [...this.classes];
  }

  async getById(id) {
    await this.delay();
    const classItem = this.classes.find(c => c.Id === id);
    if (!classItem) {
      throw new Error(`Class with ID ${id} not found`);
    }
    return { ...classItem };
  }

  async create(classData) {
    await this.delay();
    const highestId = Math.max(...this.classes.map(c => parseInt(c.Id)), 0);
    const newClass = {
      ...classData,
      Id: (highestId + 1).toString(),
      studentIds: classData.studentIds || []
    };
    this.classes.push(newClass);
    return { ...newClass };
  }

  async update(id, classData) {
    await this.delay();
    const index = this.classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Class with ID ${id} not found`);
    }
    this.classes[index] = { ...this.classes[index], ...classData };
    return { ...this.classes[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.classes.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Class with ID ${id} not found`);
    }
    const deletedClass = this.classes.splice(index, 1)[0];
    return { ...deletedClass };
  }
}

export default new ClassService();