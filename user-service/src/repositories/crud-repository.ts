import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  SortOrder,
} from "mongoose";

export interface PaginationOptions {
  limit?: number;
  skip?: number;
  sort?: Record<string, SortOrder>;
}

export class CrudRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findAll(
    filter: FilterQuery<T> = {},
    pagination: PaginationOptions = {}
  ): Promise<T[]> {
    const { limit = 10, skip = 0, sort = { createdAt: -1 } } = pagination;
    return this.model.find(filter).sort(sort).skip(skip).limit(limit).exec();
  }

  async updateById(
    id: string,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true }
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, options).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async customQuery(
    filter: FilterQuery<T>,
    options?: QueryOptions
  ): Promise<T[]> {
    return this.model.find(filter, null, options).exec();
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
