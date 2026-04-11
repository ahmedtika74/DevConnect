import { Link } from "react-router-dom";
import { formatTimeAgo } from "../../utils/formatTime";
import { Trash2 } from "lucide-react";
import Button from "./Button";
import TextArea from "./TextArea";
import Avatar from "./Avatar";

export default function PostCommentSection({
  post,
  currentUser,
  newComment,
  setNewComment,
  onAddComment,
  onDeleteComment,
}) {
  return (
    <div className="mt-4 flex flex-col gap-4 border-t border-slate-700/50 pt-4">
      {/* Add comment */}
      <div className="flex items-center gap-3">
        <Avatar src={currentUser?.avatar_url} alt="user" size="md" />
        <TextArea
          content={newComment}
          placeholder="Write a comment..."
          setContent={setNewComment}
        />
        <Button
          onClick={onAddComment}
          disabled={!newComment.trim()}
          className="text-sm font-bold text-blue-500 transition-colors disabled:text-slate-600"
        >
          Post
        </Button>
      </div>

      {/* Display old comments */}
      <div className="flex max-h-60 flex-col gap-3 overflow-y-auto pr-2">
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Avatar src={comment.users?.avatar_url} alt="avatar" size="md" />

              <div className="input-premium flex w-full flex-col gap-2 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/profile/${comment.users.username}`}
                    className="text-text-primary text-xs font-bold"
                  >
                    {comment.users?.full_name} {" • "}
                    {formatTimeAgo(comment.created_at)}
                  </Link>

                  {currentUser?.id === comment.user_id && (
                    <Button
                      className="hover:text-text-primary h-10 w-10 rounded-full text-red-500 transition-colors duration-300 hover:bg-red-500"
                      onClick={() => onDeleteComment(comment)}
                    >
                      <Trash2 size={20} />
                    </Button>
                  )}
                </div>

                <p className="text-text-secondary text-sm" dir="auto">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-text-secondary py-2 text-center text-xs">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
