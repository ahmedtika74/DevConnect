import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../features/user/userSlice";
import { X, Camera } from "lucide-react";
import Button from "./ui/Button";
import Spinner from "./ui/Spinner";
import Input from "./ui/Input";
import TextArea from "./ui/TextArea";
import Avatar from "./ui/Avatar";

export default function EditProfileModal({ isOpen, onClose, userData }) {
  const dispatch = useDispatch();

  const [name, setName] = useState(userData?.full_name);
  const [username, setUsername] = useState(userData?.username);
  const [bio, setBio] = useState(userData?.bio);
  const [image, setImage] = useState(userData?.avatar_url);
  const [cover, setCover] = useState(userData?.cover_url);
  const [imageFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (image && image.startsWith("blob:")) URL.revokeObjectURL(image);
      if (cover && cover.startsWith("blob:")) URL.revokeObjectURL(cover);
    };
  }, [image, cover]);

  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (image && image.startsWith("blob:")) URL.revokeObjectURL(image);
      setAvatarFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (cover && cover.startsWith("blob:")) URL.revokeObjectURL(cover);
      setCoverFile(file);
      setCover(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateProfile({
          userId: userData.id,
          name,
          username,
          bio,
          imageFile,
          coverFile,
        }),
      ).unwrap();

      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(
        typeof err === "string" ? err : err?.message || "An error occurred",
      );
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-section relative w-full max-w-lg rounded-2xl border border-slate-700 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
          <h2 className="text-text-primary text-xl font-bold">Edit Profile</h2>
          <Button
            onClick={onClose}
            className="hover:text-text-primary cursor-pointer rounded-full p-2 text-red-500 transition-colors hover:bg-red-700"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Cover */}
        <div
          className="relative mb-8 h-32 w-full rounded-lg bg-slate-800 bg-cover bg-center"
          style={{
            backgroundImage: `url(${cover || "/Cover.png"})`,
          }}
        >
          <label className="text-text-primary absolute right-2 bottom-2 flex cursor-pointer items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-black/80">
            <Camera size={16} /> Edit Cover
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </label>
        </div>

        {/* Avatar Photo */}
        <div className="relative -mt-16 mb-6 ml-4 h-24 w-24">
          <Avatar src={image} alt="Avatar preview" size="xl" />
          <label className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-slate-900 bg-slate-700 text-white transition-colors hover:bg-slate-600">
            <Camera size={14} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {/* Profile Data */}
        <div className="flex flex-col gap-5">
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={setName}
            placeholder="Your name"
          />

          <div>
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(val) => {
                setUsername(val);
                if (error) setError(null);
              }}
              placeholder="Your username"
            />
            {error && (
              <p className="mt-1 pl-2 text-xs font-medium text-red-500">
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="text-text-secondary mb-1.5 block pl-1 text-[12px]">
              Bio
            </label>
            <TextArea
              content={bio}
              setContent={setBio}
              placeholder="Write something about yourself..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3 border-t border-slate-700 pt-5">
          <Button
            onClick={onClose}
            className="hover:bg-glass hover:text-text-primary rounded-xl px-5 py-2 font-medium text-slate-300 transition-colors"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="btn-secondary px-6 py-2"
            loading={loading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
