import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../services/supabaseClient";
import PostCard from "../components/ui/PostCard";
import Spinner from "../components/ui/Spinner";
import { setCurrentPost } from "../features/posts/postsSlice";

export default function PostDetails() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { currentPost: post } = useSelector((state) => state.posts);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("posts")
          .select(
            `
            *,
            users:user_id(id, username, full_name, avatar_url),
            likes(user_id),
            comments(
              id, content, created_at, user_id,
              users:user_id(id, username, full_name, avatar_url)
            )
          `,
          )
          .eq("id", postId)
          .single();

        if (error) throw error;

        if (data && data.comments) {
          data.comments.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
          );
        }

        dispatch(setCurrentPost(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentPost(null));
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex h-screen flex-1 flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-bold text-slate-300">Post not found</h2>
        <p className="text-text-secondary">
          The post you are looking for does not exist or has been deleted.
        </p>
        <Link to="/" className="font-bold text-blue-500 hover:underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 flex-1 overflow-y-auto px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-4 border-b border-slate-700 pb-4">
          <h1 className="text-text-primary text-xl font-bold">Post Details</h1>
        </div>

        <PostCard post={post} />
      </div>
    </div>
  );
}
