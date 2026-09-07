import {request} from './client';
import type {CreateProjectRequest, ProjectResponse} from '../types';

export const projectApi = {
    getAllProjects: () => request<ProjectResponse[]>('/projects'),

    getProjectByPublicId: (publicId: string) =>
        request<ProjectResponse>(`/projects/${publicId}`),

    createProject: (data: CreateProjectRequest) =>
        request<ProjectResponse>('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    addUserToProject: (userPublicId: string, projectPublicId: string) =>
        request<void>(`/${userPublicId}/projects/${projectPublicId}` , {
            method: 'POST',
        })

};
