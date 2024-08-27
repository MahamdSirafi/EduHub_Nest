import { PaginatedResponse } from '../types';

export interface ICrud<T> {
  create(...n): Promise<T>;
  find(...n): Promise<T[] | PaginatedResponse<T>>;
  findOne(...n): Promise<T>;
  update(...n): Promise<T>;
  remove(...n): Promise<any>;
}

export interface INestedController<T> {
  create(...n): Promise<T>;
  find(...n): Promise<T[] | PaginatedResponse<T>>;
}

export interface IGenericController<T> {
  findOne(...n): Promise<T>;
  update(...n): Promise<T>;
  remove(...n): Promise<void>;
}
export interface IAuthController<T> {
  signup(...n): Promise<T>;
  login(...n): Promise<T>;
  updateMyPassword(...n): Promise<T>;
  forgotPassword(...n): Promise<{ message: string }>;
  resetPassword(...n): Promise<T>;
}
