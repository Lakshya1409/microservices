import { CrudRepository } from "./crud-repository";
import { UserModel, IUser } from "../models/user-model";

export class UserRepository extends CrudRepository<IUser> {
  constructor() {
    super(UserModel);


  }
  // Add any user-specific DB methods here if needed
}
