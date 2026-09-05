import React, { useState } from 'react';
import type { TaskResponse, TaskStatus, UserResponse } from '../types';
import { TaskCard } from './TaskCard';
import { Circle, Clock, CheckCircle2, Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: TaskResponse[];
  users: UserResponse[];
  onSelectTask: (task: TaskResponse) => void;
  onUpdateStatus: (taskPublicId: string, newStatus: TaskStatus) => void;
  onOpenNewTaskModal: (status?: TaskStatus) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  icon: React.ReactNode;
  headerColor: string;
  countBadgeColor: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  users,
  onSelectTask,
  onUpdateStatus,
  onOpenNewTaskModal,
}) => {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const columns: ColumnConfig[] = [
    {
      id: 'TODO',
      title: 'Yapılacaklar',
      icon: <Circle className="w-4 h-4 text-slate-500" />,
      headerColor: 'border-slate-300',
      countBadgeColor: 'bg-slate-200 text-slate-700',
    },
    {
      id: 'IN_PROGRESS',
      title: 'Devam Edenler',
      icon: <Clock className="w-4 h-4 text-indigo-500" />,
      headerColor: 'border-indigo-400',
      countBadgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'COMPLETED',
      title: 'Tamamlananlar',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      headerColor: 'border-emerald-400',
      countBadgeColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  const handleDragStart = (e: React.DragEvent, taskPublicId: string) => {
    setActiveDragId(taskPublicId);
    e.dataTransfer.setData('text/plain', taskPublicId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskPublicId = e.dataTransfer.getData('text/plain') || activeDragId;
    if (taskPublicId) {
      onUpdateStatus(taskPublicId, targetStatus);
    }
    setActiveDragId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);
        const isOver = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col bg-slate-100/70 rounded-2xl p-4 border transition-all duration-150 min-h-[500px] ${
              isOver ? 'border-indigo-500 bg-indigo-50/50 shadow-inner' : 'border-slate-200/60'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                {col.icon}
                <h3 className="font-semibold text-slate-800 text-sm tracking-tight">{col.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.countBadgeColor}`}>
                  {columnTasks.length}
                </span>
              </div>
              <button
                onClick={() => onOpenNewTaskModal(col.id)}
                title={`${col.title} sütununa görev ekle`}
                className="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task List */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
              {columnTasks.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
                  Bu sütunda görev yok
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.publicId}
                    task={task}
                    users={users}
                    onSelectTask={onSelectTask}
                    onUpdateStatus={onUpdateStatus}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
