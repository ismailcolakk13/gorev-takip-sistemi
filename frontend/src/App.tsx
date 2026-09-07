import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { CreateTaskModal } from './components/CreateTaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { CreateUserModal } from './components/CreateUserModal';
import { AddUserToProjectModal } from './components/AddUserToProjectModal';
import type {
  CreateProjectRequest,
  CreateTaskRequest,
  CreateUserRequest,
  ProjectResponse,
  TaskResponse,
  TaskStatus,
  UserResponse,
} from './types';
import { projectApi } from './api/projectApi';
import { userApi } from './api/userApi';
import { taskApi } from './api/taskApi';
import { Search, Filter, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState<string>('ALL');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAddUserToProjectModalOpen, setIsAddUserToProjectModalOpen] = useState(false);
  const [activeTaskDetail, setActiveTaskDetail] = useState<TaskResponse | null>(null);

  // Initial Load: Projects & Users
  useEffect(() => {
    initData();
  }, []);

  // When selectedProject changes, load tasks
  useEffect(() => {
    if (selectedProject) {
      loadTasks(selectedProject.publicId);
    } else {
      setTasks([]);
    }
  }, [selectedProject]);

  const initData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [fetchedProjects, fetchedUsers] = await Promise.all([
        projectApi.getAllProjects(),
        userApi.getAllUsers(),
      ]);

      setProjects(fetchedProjects);
      setUsers(fetchedUsers);

      if (fetchedProjects.length > 0) {
        setSelectedProject(fetchedProjects[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Veriler yüklenirken bir bağlantı hatası oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasks = async (projectPublicId: string) => {
    try {
      setIsRefreshing(true);
      const fetchedTasks = await taskApi.getTasksByProject(projectPublicId);
      setTasks(fetchedTasks);
    } catch (err: any) {
      console.error('Görevler yüklenemedi:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpdateStatus = async (taskPublicId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.publicId === taskPublicId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskApi.updateTaskStatus(taskPublicId, { status: newStatus });
    } catch (err: any) {
      if (selectedProject) {
        loadTasks(selectedProject.publicId);
      }
      alert('Durum güncellenirken hata oluştu: ' + err.message);
    }
  };

  const handleCreateTask = async (data: CreateTaskRequest) => {
    const newTask = await taskApi.createTask(data);
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleCreateProject = async (data: CreateProjectRequest) => {
    const newProj = await projectApi.createProject(data);
    setProjects((prev) => [...prev, newProj]);
    setSelectedProject(newProj);
    return newProj;
  };

  const handleCreateUser = async (data: CreateUserRequest, addToCurrentProject: boolean) => {
    const newUser = await userApi.createUser(data);
    setUsers((prev) => [...prev, newUser]);
    if (addToCurrentProject && selectedProject) {
      try {
        await userApi.addUserToProject(newUser.publicId, selectedProject.publicId);
      } catch (err) {
        console.error('Kullanıcı projeye eklenemedi:', err);
      }
    }
    return newUser;
  };

  const handleAddUserToProject = async (userPublicId: string, projectPublicId: string) => {
    await userApi.addUserToProject(userPublicId, projectPublicId);
  };

  const handleTaskUpdatedInModal = (updatedTask: TaskResponse) => {
    setTasks((prev) =>
      prev.map((t) => (t.publicId === updatedTask.publicId ? updatedTask : t))
    );
    setActiveTaskDetail(updatedTask);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskDetail?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUser =
        userFilter === 'ALL' ||
        (userFilter === 'UNASSIGNED' && !task.assignedUserPublicId) ||
        task.assignedUserPublicId === userFilter;

      return matchesSearch && matchesUser;
    });
  }, [tasks, searchTerm, userFilter]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
        onOpenNewProjectModal={() => setIsProjectModalOpen(true)}
        onOpenNewUserModal={() => setIsUserModalOpen(true)}
        onOpenAddUserToProjectModal={() => setIsAddUserToProjectModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1 font-medium">{error}</div>
            <button
              onClick={initData}
              className="px-3 py-1 bg-rose-100 hover:bg-rose-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Project Header Bar & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {selectedProject ? selectedProject.projectName : 'Henüz Proje Seçilmedi'}
              </h2>
              {selectedProject && (
                <button
                  onClick={() => selectedProject && loadTasks(selectedProject.publicId)}
                  disabled={isRefreshing}
                  title="Yenile"
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Search & Assignee Filter */}
          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Görev ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg w-44 sm:w-56 focus:w-64 transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* Filter by User */}
            <div className="relative flex items-center">
              <Filter className="w-3.5 h-3.5 absolute left-2.5 text-slate-400" />
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="ALL">Tüm Kullanıcılar</option>
                <option value="UNASSIGNED">Atanmamış</option>
                {users.map((u) => (
                  <option key={u.publicId} value={u.publicId}>
                    {u.userName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Board View */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-slate-500">Panolar yükleniyor...</span>
            </div>
          </div>
        ) : !selectedProject ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
            <div className="text-center p-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Hiç Proje Yok</h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                Başlamak için yukarıdaki "Proje Ekle" butonuna tıklayarak ilk projenizi oluşturun.
              </p>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                İlk Projeyi Oluştur
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <KanbanBoard
              tasks={filteredTasks}
              users={users}
              onSelectTask={(task) => setActiveTaskDetail(task)}
              onUpdateStatus={handleUpdateStatus}
              onOpenNewTaskModal={() => setIsTaskModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        project={selectedProject}
        users={users}
      />

      <TaskDetailModal
        isOpen={!!activeTaskDetail}
        task={activeTaskDetail}
        users={users}
        onClose={() => setActiveTaskDetail(null)}
        onTaskUpdated={handleTaskUpdatedInModal}
      />

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <CreateUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleCreateUser}
        currentProject={selectedProject}
      />

      <AddUserToProjectModal
        isOpen={isAddUserToProjectModalOpen}
        onClose={() => setIsAddUserToProjectModalOpen(false)}
        project={selectedProject}
        allUsers={users}
        onAddUser={handleAddUserToProject}
      />
    </div>
  );
};
export default App;
