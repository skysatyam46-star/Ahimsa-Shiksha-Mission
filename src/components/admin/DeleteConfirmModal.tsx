import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemTitle?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = 'Is content ko delete karna hai?',
  itemTitle,
  message = 'Yeh action irreversible hai. Content local store aur public website dono se hat jayega.',
  confirmLabel = 'Delete Karein',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1E293B] rounded-2xl p-5 shadow-2xl border border-[#E8E5DF] dark:border-[#334155] z-10 animate-scaleUp text-[#1F2421] dark:text-gray-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-[#DC2626] dark:text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 id="delete-modal-title" className="text-[16px] font-bold text-[#1F2421] dark:text-white">
                {title}
              </h3>
              <span className="text-[11px] font-medium text-[#8C96A3]">Confirmation required</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-[#8C96A3] hover:text-[#1F2421] dark:hover:text-white rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {itemTitle && (
          <div className="p-3 my-2 bg-[#FAF8F5] dark:bg-[#0F172A] rounded-xl border border-[#E8E5DF] dark:border-[#334155] text-[13px] font-semibold text-[#16325C] dark:text-[#93C5FD] truncate">
            “{itemTitle}”
          </div>
        )}

        <p className="text-[13px] text-[#5C6773] dark:text-gray-300 leading-relaxed mb-5">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[42px] px-4 py-2 rounded-xl text-[13px] font-medium text-[#5C6773] dark:text-gray-300 bg-[#F0ECE1] dark:bg-slate-700 hover:bg-[#E8E2D8] transition-colors tap-active"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[42px] px-5 py-2 rounded-xl text-[13px] font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors shadow-xs tap-active"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
