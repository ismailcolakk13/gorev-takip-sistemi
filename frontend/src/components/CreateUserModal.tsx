import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { CreateUserRequest, ProjectResponse, UserResponse } from '../types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest, addToCurrentProject: boolean) => Promise<UserResponse>;
  currentProject: ProjectResponse | null;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentProject,
}) => {
  const [userName, setUserName] = useState('');
  const [addToProject, setAddToProject] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Kullanıcı adı zorunludur.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(
        {
          userName: userName.trim(),
        },
        addToProject && !!currentProject
      );
      setUserName('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Kullanıcı oluşturulurken hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Yeni Kullanıcı Tanımla</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kullanıcı Adı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: ismail"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-colors"
            />
          </div>

          {currentProject && (
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="addToProject"
                checked={addToProject}
                onChange={(e) => setAddToProject(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="addToProject" className="text-xs text-slate-700 select-none">
                Doğrudan aktif projeye (<strong>{currentProject.projectName}</strong>) üye yap
              </label>
            </div>
          )}

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
              {isSubmitting ? 'Kaydediliyor...' : 'Kullanıcıyı Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
