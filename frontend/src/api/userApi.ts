import { request } from './client';
import type { CreateUserRequest, UserResponse } from '../types';

export const userApi = {
  getAllUsers: () => request<UserResponse[]>('/users'),

  getUserByPublicId: (publicId: string) =>
    request<UserResponse>(`/users/${publicId}`),

  createUser: (data: CreateUserRequest) =>
    request<UserResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  addUserToProject: (userPublicId: string, projectPublicId: string) =>
    request<void>(`/users/${userPublicId}/projects/${projectPublicId}`, {
      method: 'POST',
    }),

  getUsersByProject: (projectPublicId: string) =>
    request<UserResponse[]>(`/users/by-project/${projectPublicId}`),
};
