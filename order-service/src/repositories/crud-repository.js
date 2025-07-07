// Generic CRUD repository for Mongoose models in JavaScript

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findById(id) {
    return this.model.findById(id).exec();
  }

  async findAll(filter = {}, pagination = {}) {
    const { limit = 10, skip = 0, sort = { createdAt: -1 } } = pagination;
    return this.model.find(filter).sort(sort).skip(skip).limit(limit).exec();
  }

  async updateById(id, update, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, update, options).exec();
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id).exec();
  }

  async customQuery(filter, options) {
    return this.model.find(filter, null, options).exec();
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter).exec();
  }
}

export { CrudRepository };
