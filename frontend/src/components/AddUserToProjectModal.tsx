import React, { useState, useEffect } from 'react';
import { X, UserCheck, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ProjectResponse, UserResponse } from '../types';

interface AddUserToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectResponse | null;
  allUsers: UserResponse[];
  onAddUser: (userPublicId: string, projectPublicId: string) => Promise<void>;
}

export const AddUserToProjectModal: React.FC<AddUserToProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  allUsers,
  onAddUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedUserId(null);
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredUsers = allUsers.filter((u) =>
    u.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUser = allUsers.find((u) => u.publicId === selectedUserId) ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Lütfen bir kullanıcı seçin.');
      return;
    }
    if (!project) {
      setError('Aktif proje bulunamadı.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      await onAddUser(selectedUserId, project.publicId);
      setSuccessMessage(
        `"${selectedUser?.userName}" kullanıcısı "${project.projectName}" projesine eklendi.`
      );
      setSelectedUserId(null);
      setSearchTerm('');
    } catch (err: any) {
      setError(err.message || 'Kullanıcı projeye eklenirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Projeye Kullanıcı Ekle</h3>
            {project && (
              <p className="text-xs text-slate-500 mt-0.5">
                Proje: <span className="font-semibold text-indigo-600">{project.projectName}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kullanıcı Ara
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Kullanıcı adı ile ara..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedUserId(null);
                }}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* User List */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kullanıcı Seç *
            </label>
            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-52 overflow-y-auto divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-slate-500">
                  {allUsers.length === 0
                    ? 'Henüz kayıtlı kullanıcı yok.'
                    : 'Aramanızla eşleşen kullanıcı bulunamadı.'}
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedUserId === user.publicId;
                  return (
                    <button
                      key={user.publicId}
                      type="button"
                      onClick={() => {
                        setSelectedUserId(user.publicId);
                        setError(null);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-3 shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {user.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="flex-1 truncate">{user.userName}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-2 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected preview */}
          {selectedUser && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-700">
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>
                <strong>{selectedUser.userName}</strong> seçildi
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Kapat
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedUserId}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
            >
              {isSubmitting ? 'Ekleniyor...' : 'Projeye Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
