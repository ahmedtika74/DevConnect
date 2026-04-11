import { Link } from "react-router-dom";
import { formatTimeAgo } from "../../utils/formatTime";
import { Edit2, Check, Trash2 } from "lucide-react";
import Button from "./Button";
import Avatar from "./Avatar";

export default function PostAuthorHeader({
  post,
  isMyPost,
  displayAvatar,
  displayName,
  isEditing,
  onEditToggle,
  onDelete,
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-start gap-3">
        <Avatar src={displayAvatar} alt="user avatar" />
        <div>
          <p className="text-text-primary -mb-1 font-semibold">{displayName}</p>
          <div className="text-text-secondary flex items-center justify-center gap-1 text-[12px]">
            <Link to={`/profile/${post.users.username}`}>
              @{post.users.username} •
            </Link>
            <span>{formatTimeAgo(post.created_at)}</span>
          </div>
        </div>
      </div>
      <div className="relative">
        {isMyPost && (
          <div className="flex items-center justify-center gap-3">
            <Button
              className={`transition-colors duration-300 ${
                isEditing
                  ? "hover:text-text-primary h-10 w-10 rounded-full text-green-500 hover:bg-green-500"
                  : "hover:text-text-primary h-10 w-10 rounded-full text-blue-500 hover:bg-blue-500"
              }`}
              onClick={onEditToggle}
            >
              {isEditing ? <Check size={25} /> : <Edit2 size={25} />}
            </Button>
            <Button
              className="hover:text-text-primary h-10 w-10 rounded-full text-red-500 transition-colors duration-300 hover:bg-red-500"
              onClick={onDelete}
            >
              <Trash2 size={25} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
