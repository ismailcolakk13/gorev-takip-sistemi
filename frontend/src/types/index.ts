export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface TaskResponse {
  publicId: string;
  taskName: string;
  taskDetail: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectPublicId: string;
  assignedUserPublicId: string | null;
}

export interface CreateTaskRequest {
  taskName: string;
  taskDetail: string;
  priority: TaskPriority;
  projectPublicId: string;
  assignedUserPublicId?: string | null;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface ProjectResponse {
  publicId: string;
  projectName: string;
}

export interface CreateProjectRequest {
  projectName: string;
}

export interface UserResponse {
  publicId: string;
  userName: string;
}

export interface CreateUserRequest {
  userName: string;
}

export interface CommentResponse {
  publicId: string;
  commentDetail: string;
  commentedUserPublicId: string;
  taskPublicId: string;
}

export interface CreateCommentRequest {
  commentDetail: string;
  userPublicId: string;
}
