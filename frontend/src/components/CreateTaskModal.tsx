import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { CreateTaskRequest, ProjectResponse, TaskPriority, UserResponse } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskRequest) => Promise<void>;
  project: ProjectResponse | null;
  users: UserResponse[];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  users,
}) => {
  const [taskName, setTaskName] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [assignedUserPublicId, setAssignedUserPublicId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setError('Görev başlığı zorunludur.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        taskName: taskName.trim(),
        taskDetail: taskDetail.trim(),
        priority,
        projectPublicId: project.publicId,
        assignedUserPublicId: assignedUserPublicId || null,
      });
      // reset
      setTaskName('');
      setTaskDetail('');
      setPriority('MEDIUM');
      setAssignedUserPublicId('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Görev oluşturulurken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Yeni Görev Oluştur</h3>
            <p className="text-xs text-slate-500 mt-0.5">Proje: {project.projectName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Görev Başlığı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: API Entegrasyonunu Tamamla"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Görev Detayı
            </label>
            <textarea
              rows={3}
              placeholder="Görevin kapsamı ve yapılacak adımlar..."
              value={taskDetail}
              onChange={(e) => setTaskDetail(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Öncelik
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white cursor-pointer"
              >
                <option value="LOW">Düşük</option>
                <option value="MEDIUM">Orta</option>
                <option value="HIGH">Yüksek</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Atanan Kullanıcı
              </label>
              <select
                value={assignedUserPublicId}
                onChange={(e) => setAssignedUserPublicId(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white cursor-pointer"
              >
                <option value="">Atanmamış</option>
                {users.map((u) => (
                  <option key={u.publicId} value={u.publicId}>
                    {u.userName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 transition-colors shadow-xs"
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Görevi Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
