import Button from "./Button";
import { AlertCircle } from "lucide-react";

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-section relative w-full max-w-sm rounded-2xl border border-slate-700 p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
          <AlertCircle className="text-red-500" size={24} />
          <h2 className="text-text-primary text-lg font-bold">Please Confirm</h2>
        </div>
        <p className="text-text-secondary text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3 flex-wrap">
          <Button
            onClick={onCancel}
            className="hover:bg-glass hover:text-text-primary rounded-xl px-5 py-2 font-medium text-slate-300 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-6 py-2 font-bold text-white transition-colors hover:bg-red-700"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
