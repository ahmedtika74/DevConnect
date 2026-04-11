import { Heart, MessageSquare } from "lucide-react";
import Button from "./Button";

export default function PostActions({
  post,
  isLiked,
  showComments,
  onLike,
  onToggleComments,
}) {
  return (
    <div className="text-text-primary flex items-center justify-start gap-10">
      <Button
        className={`transition ${isLiked ? "text-red-500" : "text-text-secondary"}`}
        onClick={onLike}
      >
        <Heart fill={isLiked ? "currentColor" : "none"} />
        <span>{post.likes?.length || 0}</span>
      </Button>
      <Button
        className={`transition-colors ${showComments ? "text-blue-500" : "text-text-primary"}`}
        onClick={onToggleComments}
      >
        <MessageSquare />
        <span>{post.comments?.length || 0}</span>
      </Button>
    </div>
  );
}
