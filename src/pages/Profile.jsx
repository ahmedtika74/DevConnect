import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useEffect, useState } from "react";
import { fetchProfilePosts, resetProfile } from "../features/posts/postsSlice";
import Spinner from "../components/ui/Spinner";
import CreatePostForm from "../components/CreatePostForm";
import ProfileHeader from "../components/ProfileHeader";
import ProfileFeed from "../components/ProfileFeed";

export default function Profile() {
  const { username } = useParams();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  const [profileUser, setProfileUser] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    dispatch(resetProfile());

    const loadProfile = async () => {
      setProfileUser(null);
      setIsNotFound(false);

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error || !userData) {
        setIsNotFound(true);
        return;
      }

      setProfileUser(userData);
      dispatch(fetchProfilePosts({ page: 0, userId: userData.id }));
    };

    loadProfile();
  }, [username, dispatch]);

  // Loading Profile
  if (!currentUser && !isNotFound) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Profile Not Found
  if (isNotFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <p className="text-text-primary text-3xl font-bold xl:text-6xl">
          User not found!
        </p>
        <Link to="/" className="btn-primary px-6 py-2 text-xl xl:text-2xl">
          Go Home
        </Link>
      </div>
    );
  }

  const displayUser =
    currentUser?.id === profileUser?.id ? currentUser : profileUser;

  return (
    displayUser && (
      <div className="bg-section mx-auto min-h-screen w-full max-w-4xl text-white">
        {/* User Info */}
        <ProfileHeader profileUser={displayUser} currentUser={currentUser} />

        {/* Create Post */}
        {currentUser?.id === displayUser?.id && (
          <div className="border-t-glass mt-10 flex h-full flex-col gap-5 border-t-4 px-1 pt-10">
            <CreatePostForm />
          </div>
        )}

        {/* Profile Posts */}
        <ProfileFeed profileUser={displayUser} />
      </div>
    )
  );
}
