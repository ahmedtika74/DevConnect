import Button from "../ui/Button";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../../services/supabaseClient";
import { Link } from "react-router-dom";
import { toggleFollow } from "../../features/user/followSlice";
import Avatar from "../ui/Avatar";
import SearchBar from "../ui/SearchBar";

export default function RightBar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followedIds, setFollowedIds] = useState([]);

  useEffect(() => {
    if (!currentUser?.id) {
      setIsLoading(false);
      return;
    }

    const fetchSuggestedUsers = async () => {
      try {
        setIsLoading(true);

        const { data: myFollows, error: followsError } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", currentUser.id);

        if (followsError) throw followsError;

        const alreadyFollowedIds = myFollows.map((f) => f.following_id);
        const idsToExclude = [...alreadyFollowedIds, currentUser.id];

        const { data, error } = await supabase
          .from("users")
          .select("id, full_name, username, avatar_url")
          .not("id", "in", `(${idsToExclude.join(",")})`)
          .limit(10);

        if (error) throw error;
        setSuggestedUsers(data);
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, [currentUser?.id]);

  const handleToggleFollow = async (userId) => {
    const isFollowing = followedIds.includes(userId);

    if (isFollowing) {
      setFollowedIds((prev) => prev.filter((id) => id !== userId));
    } else {
      setFollowedIds((prev) => [...prev, userId]);
    }

    try {
      await dispatch(
        toggleFollow({
          currentUserId: currentUser?.id,
          profileId: userId,
          isFollowing: isFollowing,
        }),
      ).unwrap();
    } catch (error) {
      console.log("Failed to follow/unfollow", error);

      if (isFollowing) {
        setFollowedIds((prev) => [...prev, userId]);
      } else {
        setFollowedIds((prev) => prev.filter((id) => id !== userId));
      }
    }
  };

  return (
    <div className="bg-sidebar fixed top-0 right-0 hidden h-screen w-80 flex-col gap-6 overflow-y-auto border-l border-slate-700 p-6 xl:flex">
      <SearchBar />

      {/* Suggested Users */}
      <div className="h-fit rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
        <h2 className="mb-4 text-xl font-bold text-white">Users to follow</h2>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <p className="py-4 text-center text-sm text-slate-400">
              Loading users...
            </p>
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => {
              const isFollowing = followedIds.includes(user.id);

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/profile/${user.username}`}
                      className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-700 transition-opacity hover:opacity-80"
                    >
                      <Avatar src={user.avatar_url} alt={user.username} />
                    </Link>
                    <div className="flex flex-col overflow-hidden">
                      <Link
                        to={`/profile/${user.username}`}
                        className="text-text-primary truncate text-sm font-bold hover:underline"
                      >
                        {user.full_name}
                      </Link>
                      <p className="text-text-secondary truncate text-xs">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  <Button
                    className={`px-4 py-1.5 text-xs font-bold ${
                      isFollowing
                        ? "rounded-full bg-red-700 text-white hover:bg-red-900"
                        : "btn-secondary"
                    }`}
                    onClick={() => handleToggleFollow(user.id)}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="text-text-secondary py-4 text-center text-sm">
              No suggestions right now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
