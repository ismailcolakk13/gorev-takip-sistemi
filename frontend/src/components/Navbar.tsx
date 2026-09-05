import React from 'react';
import { CheckSquare, FolderPlus, Plus, UserPlus } from 'lucide-react';
import type { ProjectResponse } from '../types';

interface NavbarProps {
  projects: ProjectResponse[];
  selectedProject: ProjectResponse | null;
  onSelectProject: (project: ProjectResponse) => void;
  onOpenNewTaskModal: () => void;
  onOpenNewProjectModal: () => void;
  onOpenNewUserModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onOpenNewTaskModal,
  onOpenNewProjectModal,
  onOpenNewUserModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight m-0">
              Görev Takip
            </h1>
            <span className="text-xs text-slate-500 font-medium">Kanban & Proje Yönetimi</span>
          </div>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center space-x-3">
          {/* Project Dropdown */}
          <div className="relative">
            <select
              className="bg-slate-50 border border-slate-300 text-slate-800 text-sm font-medium rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2 cursor-pointer transition-colors"
              value={selectedProject?.publicId || ''}
              onChange={(e) => {
                const found = projects.find((p) => p.publicId === e.target.value);
                if (found) onSelectProject(found);
              }}
            >
              {projects.length === 0 ? (
                <option value="">Proje Bulunamadı</option>
              ) : (
                projects.map((p) => (
                  <option key={p.publicId} value={p.publicId}>
                    📁 {p.projectName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* New Project Button */}
          <button
            onClick={onOpenNewProjectModal}
            title="Yeni Proje Oluştur"
            className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs"
          >
            <FolderPlus className="w-4 h-4 mr-1.5 text-slate-500" />
            <span className="hidden sm:inline">Proje Ekle</span>
          </button>

          {/* New User Button */}
          <button
            onClick={onOpenNewUserModal}
            title="Yeni Kullanıcı Ekle"
            className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4 mr-1.5 text-slate-500" />
            <span className="hidden sm:inline">Kullanıcı Ekle</span>
          </button>

          {/* Create Task CTA */}
          <button
            onClick={onOpenNewTaskModal}
            disabled={!selectedProject}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-indigo-200"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Yeni Görev</span>
          </button>
        </div>
      </div>
    </header>
  );
};
