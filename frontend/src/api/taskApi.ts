import { request } from './client';
import type { CreateTaskRequest, TaskResponse, UpdateTaskStatusRequest } from '../types';

export const taskApi = {
  createTask: (data: CreateTaskRequest) =>
    request<TaskResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTaskByPublicId: (publicId: string) =>
    request<TaskResponse>(`/tasks/${publicId}`),

  getTasksByProject: (projectPublicId: string) =>
    request<TaskResponse[]>(`/tasks/by-project/${projectPublicId}`),

  getTasksByAssignedUser: (userPublicId: string) =>
    request<TaskResponse[]>(`/tasks/by-user/${userPublicId}`),

  updateTaskStatus: (taskPublicId: string, status: UpdateTaskStatusRequest) =>
    request<TaskResponse>(`/tasks/${taskPublicId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(status),
    }),

  assignTask: (taskPublicId: string, userPublicId: string) =>
    request<TaskResponse>(`/tasks/${taskPublicId}/assign/${userPublicId}`, {
      method: 'PUT',
    }),
};
