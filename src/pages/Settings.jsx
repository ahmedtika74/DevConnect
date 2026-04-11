import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Lock, ShieldAlert } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import DeleteAccountModal from "../components/DeleteAccountModal";

export default function Settings() {
  const [password, setPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({
    text: "",
    type: "",
  });

  const { signOut } = useAuth();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setPasswordMessage({
        text: "Password must be at least 6 characters.",
        type: "error",
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      setPasswordMessage({ text: "", type: "" });

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setPasswordMessage({
        text: "Password updated successfully!",
        type: "success",
      });
      setPassword("");
    } catch (error) {
      setPasswordMessage({ text: error.message, type: "error" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      const { error } = await supabase.rpc("delete_user");
      if (error) throw error;

      await signOut();
    } catch (error) {
      console.log("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-text-primary mb-6 border-b border-slate-700 pb-4 text-2xl font-bold">
          Settings
        </h1>

        <div className="flex flex-col gap-8">
          <div className="bg-glass rounded-2xl border border-slate-700 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Lock className="text-blue-400" size={24} />
              <h2 className="text-text-primary text-lg font-bold">Security</h2>
            </div>
            <p className="text-text-secondary mb-6 text-sm">
              Ensure your account is using a long, random password to stay
              secure.
            </p>

            <form
              onSubmit={handleUpdatePassword}
              className="flex flex-col gap-4"
            >
              <div>
                <Input
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter new password"
                />
              </div>

              {passwordMessage.text && (
                <p
                  className={`text-sm ${
                    passwordMessage.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {passwordMessage.text}
                </p>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={isUpdatingPassword || !password.trim()}
                  className="text-text-primary rounded-full bg-blue-600 px-6 py-2 text-sm font-bold transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShieldAlert className="text-red-500" size={24} />
              <h2 className="text-lg font-bold text-red-500">Danger Zone</h2>
            </div>

            <div className="border-t border-red-900/30 pt-4">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div>
                  <h3 className="font-bold text-slate-200">Delete Account</h3>
                  <p className="text-text-secondary text-xs">
                    Permanently delete your account and all of your content.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="hover:text-text-primary self-end rounded-full border border-red-900/50 bg-transparent px-4 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={isDeleting}
      />
    </div>
  );
}
