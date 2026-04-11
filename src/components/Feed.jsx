import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFeedPosts,
  resetFeed,
  incrementFeedPage,
} from "../features/posts/postsSlice";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import Spinner from "./ui/Spinner";
import PostCard from "../components/ui/PostCard";

export default function Feed() {
  const { pageFeed, feedStatus, feedItems, feedHasMore } = useSelector(
    (state) => state.posts,
  );
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [postsType, setPostsType] = useState("all");

  useEffect(() => {
    dispatch(resetFeed());
    dispatch(
      fetchFeedPosts({
        page: 0,
        currentUserId: currentUser?.id,
        feedType: postsType,
      }),
    );
  }, [dispatch, currentUser?.id, postsType]);

  const { ref } = useInfiniteScroll({
    hasMore: feedHasMore,
    status: feedStatus,
    onLoadMore: () => {
      const nextPage = pageFeed + 1;
      dispatch(incrementFeedPage());
      dispatch(
        fetchFeedPosts({
          page: nextPage,
          currentUserId: currentUser?.id,
          feedType: postsType,
        }),
      );
    },
  });

  if (feedStatus === "loading" && feedItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="mb-6 flex border-b border-slate-700">
        <button
          onClick={() => setPostsType("all")}
          className={`flex-1 py-4 text-center font-bold transition-all ${
            postsType === "all"
              ? "text-text-primary border-b-4 border-blue-500"
              : "hover:text-text-primary text-text-secondary hover:bg-slate-800/50"
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setPostsType("following")}
          className={`flex-1 py-4 text-center font-bold transition-all ${
            postsType === "following"
              ? "text-text-primary border-b-4 border-blue-500"
              : "hover:text-text-primary text-text-secondary hover:bg-slate-800/50"
          }`}
        >
          Following
        </button>
      </div>

      {feedStatus === "succeeded" && feedItems.length === 0 ? (
        <div className="bg-glass/50 flex flex-col items-center justify-center gap-5 rounded-2xl border border-slate-700 p-10 text-center font-bold">
          <p className="text-text-primary text-2xl">Your feed is empty!</p>
          <p className="text-text-secondary mt-2">
            Follow some users or be the first to create a post right now.
          </p>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col gap-5">
          {feedItems.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <div ref={ref} className="py-10 text-center">
        {feedStatus === "loading" && <Spinner size="md" />}
        {!feedHasMore && feedItems.length > 0 && (
          <div className="text-text-secondary py-6 text-center font-medium">
            You have caught up with all posts!
          </div>
        )}
      </div>
    </div>
  );
}
