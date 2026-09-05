import React, { useEffect, useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import type { CommentResponse, TaskResponse, TaskStatus, UserResponse } from '../types';
import { commentApi } from '../api/commentApi';
import { taskApi } from '../api/taskApi';

interface TaskDetailModalProps {
  isOpen: boolean;
  task: TaskResponse | null;
  users: UserResponse[];
  onClose: () => void;
  onTaskUpdated: (updatedTask: TaskResponse) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  task,
  users,
  onClose,
  onTaskUpdated,
}) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedCommentUser, setSelectedCommentUser] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && task) {
      loadComments(task.publicId);
      if (users.length > 0 && !selectedCommentUser) {
        setSelectedCommentUser(users[0].publicId);
      }
    }
  }, [isOpen, task]);

  const loadComments = async (taskPublicId: string) => {
    try {
      setIsLoadingComments(true);
      const data = await commentApi.getCommentsByTask(taskPublicId);
      setComments(data);
    } catch (err) {
      console.error('Yorumlar yüklenemedi:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  if (!isOpen || !task) return null;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      const updated = await taskApi.updateTaskStatus(task.publicId, { status: newStatus });
      onTaskUpdated(updated);
    } catch (err: any) {
      setError(err.message || 'Durum güncellenemedi');
    }
  };

  const handleAssignUser = async (userPublicId: string) => {
    if (!userPublicId) return;
    try {
      const updated = await taskApi.assignTask(task.publicId, userPublicId);
      onTaskUpdated(updated);
    } catch (err: any) {
      setError(err.message || 'Kullanıcı atanamadı');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedCommentUser) return;

    try {
      setIsSubmittingComment(true);
      setError(null);
      const newComment = await commentApi.addComment(task.publicId, {
        commentDetail: newCommentText.trim(),
        userPublicId: selectedCommentUser,
      });
      setComments((prev) => [...prev, newComment]);
      setNewCommentText('');
    } catch (err: any) {
      setError(err.message || 'Yorum eklenemedi');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-500">#{task.publicId.slice(0, 8)}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {task.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{task.taskName}</h2>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {task.taskDetail || 'Açıklama girilmemiş.'}
            </p>
          </div>

          {/* Quick Controls: Status & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Durum Değiştir</label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                className="w-full text-sm font-medium px-3 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer"
              >
                <option value="TODO">Yapılacaklar</option>
                <option value="IN_PROGRESS">Devam Edenler</option>
                <option value="COMPLETED">Tamamlandı</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Görev Sahibi</label>
              <select
                value={task.assignedUserPublicId || ''}
                onChange={(e) => handleAssignUser(e.target.value)}
                className="w-full text-sm font-medium px-3 py-2 rounded-lg border border-slate-300 bg-white cursor-pointer"
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

          {/* Comments Section */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-slate-900 text-sm">Yorumlar ({comments.length})</h3>
            </div>

            {/* Comment List */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
              {isLoadingComments ? (
                <div className="text-center py-4 text-xs text-slate-400">Yorumlar yükleniyor...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Henüz yorum yapılmamış. İlk yorumu siz yapın!
                </div>
              ) : (
                comments.map((comment) => {
                  const commentAuthor = users.find((u) => u.publicId === comment.commentedUserPublicId);
                  return (
                    <div key={comment.publicId} className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-slate-800">
                          {commentAuthor ? commentAuthor.userName : 'Kullanıcı'}
                        </span>
                        <span className="text-[11px] text-slate-400">#{comment.publicId.slice(0, 8)}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{comment.commentDetail}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-2">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCommentUser}
                  onChange={(e) => setSelectedCommentUser(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium cursor-pointer"
                >
                  {users.map((u) => (
                    <option key={u.publicId} value={u.publicId}>
                      {u.userName} olarak yorum yap
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Yorumunuzu yazın..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 text-sm px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !newCommentText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gönder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
