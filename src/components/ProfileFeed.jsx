import { useSelector, useDispatch } from "react-redux";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import {
  fetchProfilePosts,
  incrementProfilePage,
} from "../features/posts/postsSlice";
import PostCard from "./ui/PostCard";
import Spinner from "./ui/Spinner";

export default function ProfileFeed({ profileUser }) {
  const dispatch = useDispatch();
  const { profileItems, profileStatus, pageProfile, profileHasMore } =
    useSelector((state) => state.posts);

  const { ref } = useInfiniteScroll({
    hasMore: profileHasMore,
    status: profileStatus,
    onLoadMore: () => {
      if (profileItems.length > 0) {
        const nextPage = pageProfile + 1;
        dispatch(incrementProfilePage());
        dispatch(fetchProfilePosts({ page: nextPage, userId: profileUser.id }));
      }
    },
  });

  return (
    <div className="border-t-glass mt-10 flex h-full flex-col gap-5 border-t-4 px-5">
      <p className="mt-5 px-3 text-xl font-black">Posts</p>
      {profileItems?.length ? (
        profileItems?.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="text-text-primary my-10 text-center text-3xl font-bold">
          No posts yet!
        </div>
      )}

      <div ref={ref} className="py-10 text-center">
        {profileStatus === "loading" && <Spinner size="md" />}
        {!profileHasMore && profileItems.length > 0 && (
          <div className="text-text-secondary py-6 text-center font-medium">
            You have caught up with all posts!
          </div>
        )}
      </div>
    </div>
  );
}
