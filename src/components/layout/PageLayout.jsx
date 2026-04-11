import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../services/supabaseClient";
import { fetchUnreadCount, incrementUnreadCount } from "../../features/notifications/notificationSlice";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RightBar from "./RightBar";
import BottomNav from "./BottomNav";

export default function PageLayout() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) return;
    
    dispatch(fetchUnreadCount(currentUser.id));

    const channel = supabase
      .channel("global-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUser.id}`,
        },
        () => {
          dispatch(incrementUnreadCount());
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, dispatch]);

  return (
    <div className="flex items-start justify-center">
      <Sidebar />
      <div className="min-h-screen flex-1 pb-20 lg:ml-74 lg:pb-0 xl:mr-80">
        <Outlet />
      </div>
      <BottomNav />
      <RightBar />
    </div>
  );
}
