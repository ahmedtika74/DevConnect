import { X, ShieldAlert } from "lucide-react";
import Button from "./ui/Button";

export default function DeleteAccountModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-section relative w-full max-w-md rounded-2xl border border-slate-700 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-red-500" size={24} />
            <h2 className="text-text-primary text-xl font-bold">Delete Account</h2>
          </div>
          <Button
            onClick={onClose}
            className="hover:text-text-primary cursor-pointer rounded-full p-2 text-red-500 transition-colors hover:bg-red-700"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Content */}
        <div className="py-4">
          <p className="text-text-secondary text-sm">
            Are you absolutely sure? This action cannot be undone and will permanently delete your account, all your posts, and all your data.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-700 pt-5">
          <Button
            onClick={onClose}
            className="hover:bg-glass hover:text-text-primary rounded-xl px-5 py-2 font-medium text-slate-300 transition-colors"
            loading={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-6 py-2 font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            loading={loading}
          >
            Yes, Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
