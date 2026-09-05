import { request } from './client';
import type { CommentResponse, CreateCommentRequest } from '../types';

export const commentApi = {
  getCommentsByTask: (taskPublicId: string) =>
    request<CommentResponse[]>(`/tasks/${taskPublicId}/comments`),

  addComment: (taskPublicId: string, data: CreateCommentRequest) =>
    request<CommentResponse>(`/tasks/${taskPublicId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
