import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost } from "../features/posts/postsSlice";
import { useParams } from "react-router-dom";
import { Image } from "lucide-react";
import Spinner from "./ui/Spinner";
import TextArea from "./ui/TextArea";
import Button from "./ui/Button";
import Avatar from "./ui/Avatar";

export default function CreatePostForm() {
  const dispatch = useDispatch();
  const { currentUser, status } = useSelector((state) => state.user);
  const { username } = useParams();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handlePost = async () => {
    if (!content && !image) {
      return setError("Please fill in all fields");
    }

    setLoading(true);
    setError("");

    try {
      await dispatch(
        createNewPost({ content, image, currentUser, username }),
      ).unwrap();

      setContent("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="bg-glass/70 flex flex-col items-center justify-center gap-4 rounded-2xl p-6 xl:min-w-2xl">
        <div className="flex w-full gap-4">
          <Avatar src={currentUser?.avatar_url} alt="user avatar" size="lg" />

          <div className="flex-1">
            <TextArea
              placeholder="What are you working on?"
              setContent={setContent}
              content={content}
              setError={setError}
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label htmlFor="file-upload" className="icon-upload-btn">
                  <Image />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden-input"
                  onChange={handleImageChange}
                />
                <span className="text-text-secondary max-w-37.5 truncate text-xs">
                  {image ? image.name : "No file chosen"}
                </span>
              </div>

              <Button
                loading={loading}
                className="btn-secondary px-6 py-1"
                onClick={handlePost}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
        {error && <div className="text-center text-red-500">{error}</div>}
      </div>
    </div>
  );
}
