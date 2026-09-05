import React from 'react';
import { User, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { TaskPriority, TaskResponse, TaskStatus, UserResponse } from '../types';

interface TaskCardProps {
  task: TaskResponse;
  users: UserResponse[];
  onSelectTask: (task: TaskResponse) => void;
  onUpdateStatus: (taskPublicId: string, newStatus: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, taskPublicId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  users,
  onSelectTask,
  onUpdateStatus,
  onDragStart,
}) => {
  const assignedUser = users.find((u) => u.publicId === task.assignedUserPublicId);

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Yüksek
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Orta
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Düşük
          </span>
        );
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.publicId)}
      onClick={() => onSelectTask(task)}
      className="group bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer select-none relative flex flex-col justify-between"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {getPriorityBadge(task.priority)}
          <span className="text-[11px] font-mono text-slate-400">#{task.publicId.slice(0, 8)}</span>
        </div>

        {/* Task Title */}
        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
          {task.taskName}
        </h4>

        {/* Task Detail Snippet */}
        {task.taskDetail && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {task.taskDetail}
          </p>
        )}
      </div>

      {/* Footer info & status quick mover */}
      <div className="pt-3 mt-1 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        {/* Assignee info */}
        <div className="flex items-center space-x-1.5 min-w-0" title={assignedUser ? assignedUser.userName : 'Atanmamış'}>
          <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <User className="w-3 h-3" />
          </div>
          <span className="truncate max-w-[90px] font-medium text-slate-600">
            {assignedUser ? assignedUser.userName : 'Atanmamış'}
          </span>
        </div>

        {/* Quick status transitions */}
        <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
          {task.status === 'TODO' && (
            <button
              onClick={() => onUpdateStatus(task.publicId, 'IN_PROGRESS')}
              title="Devam Ediyor'a taşı"
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {task.status === 'IN_PROGRESS' && (
            <>
              <button
                onClick={() => onUpdateStatus(task.publicId, 'TODO')}
                title="Yapılacaklar'a taşı"
                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateStatus(task.publicId, 'COMPLETED')}
                title="Tamamlandı'ya taşı"
                className="p-1 hover:bg-emerald-50 rounded text-slate-500 hover:text-emerald-600"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {task.status === 'COMPLETED' && (
            <button
              onClick={() => onUpdateStatus(task.publicId, 'IN_PROGRESS')}
              title="Geri al (Devam Ediyor)"
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
