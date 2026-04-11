import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  updatePost,
  addComment,
  deleteComment,
} from "../../features/posts/postsSlice";
import { toggleLikeThunk } from "../../features/posts/postsThunks";

import TextArea from "./TextArea";
import ConfirmModal from "./ConfirmModal";
import PostAuthorHeader from "./PostAuthorHeader";
import PostActions from "./PostActions";
import PostCommentSection from "./PostCommentSection";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [deleteCommentModalConfig, setDeleteCommentModalConfig] =
    useState(null);

  const isLiked = post.likes?.some((like) => like.user_id === currentUser?.id);
  const isMyPost = currentUser?.id === post.user_id;

  const displayAvatar = isMyPost
    ? currentUser?.avatar_url
    : post.users?.avatar_url;
  const displayName = isMyPost ? currentUser?.full_name : post.users?.full_name;

  const handleLike = () => {
    if (!currentUser) return;
    dispatch(
      toggleLikeThunk({ postId: post.id, userId: currentUser.id, isLiked }),
    );
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (editContent !== post.content) {
        dispatch(updatePost({ post: { id: post.id, content: editContent } }));
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleDeletePostConfirm = () => {
    dispatch(deletePost({ postId: post.id }));
    setDeletePostModalOpen(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;
    dispatch(
      addComment({
        postId: post.id,
        userId: currentUser.id,
        content: newComment,
      }),
    );
    setNewComment("");
  };

  const handleDeleteCommentConfirm = () => {
    if (deleteCommentModalConfig) {
      dispatch(
        deleteComment({
          commentId: deleteCommentModalConfig.id,
          postId: post.id,
        }),
      );
      setDeleteCommentModalConfig(null);
    }
  };

  return (
    <div className="bg-glass/70 flex w-full flex-col gap-5 rounded-2xl p-6">
      <PostAuthorHeader
        post={post}
        isMyPost={isMyPost}
        displayAvatar={displayAvatar}
        displayName={displayName}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        onDelete={() => setDeletePostModalOpen(true)}
      />

      <div className="flex flex-col justify-center gap-3">
        {isMyPost && isEditing ? (
          <TextArea
            placeholder="Enter post content..."
            content={editContent}
            setContent={setEditContent}
          />
        ) : (
          <p className="text-text-primary" dir="auto">
            {post.content}
          </p>
        )}

        {post.image_url && (
          <div className="mt-3 w-full overflow-hidden rounded-xl border border-slate-700 bg-black/20">
            <img
              src={post.image_url}
              alt="post image"
              className="max-h-125 w-full object-contain"
            />
          </div>
        )}
      </div>

      <PostActions
        post={post}
        isLiked={isLiked}
        showComments={showComments}
        onLike={handleLike}
        onToggleComments={() => setShowComments(!showComments)}
      />

      {showComments && (
        <PostCommentSection
          post={post}
          currentUser={currentUser}
          newComment={newComment}
          setNewComment={setNewComment}
          onAddComment={handleAddComment}
          onDeleteComment={(comment) => setDeleteCommentModalConfig(comment)}
        />
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={deletePostModalOpen}
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={handleDeletePostConfirm}
        onCancel={() => setDeletePostModalOpen(false)}
      />
      <ConfirmModal
        isOpen={!!deleteCommentModalConfig}
        message="Are you sure you want to delete this comment?"
        onConfirm={handleDeleteCommentConfirm}
        onCancel={() => setDeleteCommentModalConfig(null)}
      />
    </div>
  );
}
