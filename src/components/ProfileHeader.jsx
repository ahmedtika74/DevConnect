import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleFollow, fetchFollowData } from "../features/user/followSlice";
import EditProfileModal from "./EditProfileModal";
import Button from "./ui/Button";
import Avatar from "./ui/Avatar";

export default function ProfileHeader({ profileUser, currentUser }) {
  const dispatch = useDispatch();
  const { followers, following, isFollowing } = useSelector(
    (state) => state.follow,
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (profileUser?.id) {
      dispatch(
        fetchFollowData({
          currentUserId: currentUser?.id,
          profileId: profileUser.id,
        }),
      );
    }
  }, [dispatch, currentUser?.id, profileUser?.id]);

  const handleEditProfile = () => {
    setIsOpen(true);
  };
  const handleCloseEditProfile = () => {
    setIsOpen(false);
  };

  const handleToggleFollow = () => {
    dispatch(
      toggleFollow({
        currentUserId: currentUser?.id,
        profileId: profileUser.id,
        isFollowing: isFollowing,
      }),
    );
  };

  return (
    <>
      <div
        className={`relative h-48 w-full bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: `url(${profileUser?.cover_url || "/Cover.png"})`,
        }}
      >
        <div className="absolute -bottom-16 left-8">
          <Avatar
            src={profileUser?.avatar_url}
            alt={`${profileUser?.full_name}'s photo`}
            size="xxl"
          />
        </div>
      </div>

      <div className="mt-2 flex justify-end p-4">
        {currentUser?.id !== profileUser?.id ? (
          <Button
            className={`px-5 py-2 ${isFollowing ? "rounded-full bg-red-700 hover:bg-red-900" : "btn-secondary"}`}
            onClick={handleToggleFollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        ) : (
          <Button
            className="btn-secondary px-5 py-2"
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="mt-2 px-8">
        <p className="text-2xl font-bold">{profileUser?.full_name}</p>
        <span className="text-slate-400">@{profileUser?.username}</span>
        <p className="mt-4 whitespace-pre-line" dir="auto">
          {profileUser?.bio}
        </p>

        <div className="text-text-secondary mt-4 flex gap-6">
          <div className="hover:text-text-primary flex cursor-pointer gap-1.5 transition-colors">
            <span className="text-text-primary font-bold">
              {followers || 0}
            </span>
            <span>Followers</span>
          </div>
          <div className="hover:text-text-primary flex cursor-pointer gap-1.5 transition-colors">
            <span className="text-text-primary font-bold">
              {following || 0}
            </span>
            <span>Following</span>
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isOpen}
        onClose={handleCloseEditProfile}
        userData={currentUser}
      />
    </>
  );
}
