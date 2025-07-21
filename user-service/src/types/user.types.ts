export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;
  role: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;
  role: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreateData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  isVerified?: boolean;
  isActive?: boolean;
  role?: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  profileImage?: string;
  isActive?: boolean;
  isVerified?: boolean;
  role?: string;
}

export interface UserListResponse {
  users: UserProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserFilters {
  isActive?: boolean;
  isVerified?: boolean;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}
