import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../services/supabaseClient";
import { formatTimeAgo } from "../utils/formatTime";
import {
  decrementUnreadCount,
  markAllAsRead,
} from "../features/notifications/notificationSlice";
import { Bell, Check, Heart, MessageSquare, UserPlus } from "lucide-react";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";

export default function Notification() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          *,
          sender:sender_id(id, full_name, username, avatar_url)
        `,
        )
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.log("Error fetching notifications:", error.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchNotifications();

    if (currentUser) {
      const channel = supabase
        .channel("public:notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${currentUser.id}`,
          },
          () => {
            fetchNotifications();
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser, fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif,
        ),
      );
      dispatch(decrementUnreadCount());
    } catch (error) {
      console.log("Error marking as read:", error.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", currentUser.id)
        .eq("is_read", false);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true })),
      );
      dispatch(markAllAsRead());
    } catch (error) {
      console.log("Error marking all as read:", error.message);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="text-red-500" size={20} fill="currentColor" />;
      case "comment":
        return (
          <MessageSquare
            className="text-blue-500"
            size={20}
            fill="currentColor"
          />
        );
      case "follow":
        return <UserPlus className="text-green-500" size={20} />;
      default:
        return <Bell className="text-slate-400" size={20} />;
    }
  };

  const getNotificationText = (type) => {
    switch (type) {
      case "like":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      case "follow":
        return "started following you.";
      default:
        return "interacted with you.";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-slate-700 pb-4">
          <h1 className="text-text-primary flex items-center gap-2 text-2xl font-bold">
            <Bell size={28} /> Notifications
          </h1>
          {notifications.some((n) => !n.is_read) && (
            <Button
              onClick={handleMarkAllAsRead}
              className="text-sm font-bold text-blue-400 transition-colors hover:text-blue-300"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="flex flex-col gap-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 transition-colors ${
                  !notif.is_read
                    ? "border-blue-500/30 bg-blue-900/10"
                    : "bg-glass border-slate-700/50"
                }`}
              >
                <Link to={`/profile/${notif.sender?.username}`}>
                  <Avatar
                    src={notif.sender?.avatar_url}
                    alt={notif.sender?.username}
                    size="lg"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-center">
                  <div className="mb-1 flex items-center gap-2">
                    {getNotificationIcon(notif.type)}
                    <span className="text-sm">
                      <Link
                        to={`/profile/${notif.sender?.username}`}
                        className="text-text-primary font-bold hover:underline"
                      >
                        {notif.sender?.full_name}
                      </Link>{" "}
                      <span className="text-text-secondary">
                        {getNotificationText(notif.type)}
                      </span>
                    </span>
                  </div>
                  <div className="text-text-secondary mt-1 flex items-center gap-3 text-xs">
                    <span>{formatTimeAgo(notif.created_at)}</span>
                    {notif.post_id && (
                      <Link
                        to={`/posts/${notif.post_id}`}
                        className="font-medium text-blue-400 hover:underline"
                      >
                        View Post
                      </Link>
                    )}
                  </div>
                </div>

                {!notif.is_read && (
                  <Button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="hover:text-text-primary h-8 w-8 shrink-0 rounded-full text-slate-400 transition-colors hover:bg-slate-700"
                  >
                    <Check size={18} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-20 flex flex-col items-center justify-center text-slate-500">
            <Bell size={64} className="mb-4 opacity-20" />
            <p className="text-lg">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
