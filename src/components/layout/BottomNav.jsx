import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { Home, User, Bell, Search, Settings, LogOut, X } from "lucide-react";
import { logoutUser } from "../../features/user/userSlice";
import { useState } from "react";
import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";

export default function BottomNav() {
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const { currentUser } = useSelector((state) => state.user);
  const { unreadCount } = useSelector((state) => state.notifications);
  const [showSearch, setShowSearch] = useState(false);

  const navLinkStyles = ({ isActive }) =>
    `flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "text-blue-500 bg-slate-800"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
    }`;

  return (
    <>
      {showSearch && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-md">
            <SearchBar onNavigate={() => setShowSearch(false)} />
          </div>
          <Button
            onClick={() => setShowSearch(false)}
            className="absolute top-6 right-6 text-lg font-bold text-slate-300 hover:text-white"
          >
            <X size={25} />
          </Button>
        </div>
      )}

      <div className="bg-sidebar fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-slate-700 py-2 lg:hidden">
        <NavLink to="/" className={navLinkStyles}>
          <Home size={24} />
        </NavLink>

        <Button
          onClick={() => setShowSearch(true)}
          className="flex flex-col items-center justify-center rounded-xl p-3 text-slate-400 transition-all duration-200 hover:bg-slate-800/50 hover:text-slate-200"
        >
          <Search size={24} />
        </Button>

        <NavLink to="/notification" className={navLinkStyles}>
          <div className="relative flex items-center justify-center">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        </NavLink>

        <NavLink
          to={`/profile/${currentUser?.username}`}
          className={navLinkStyles}
        >
          <User size={24} />
        </NavLink>

        <NavLink to="/settings" className={navLinkStyles}>
          <Settings size={24} />
        </NavLink>

        <Button
          onClick={() => {
            signOut();
            dispatch(logoutUser());
          }}
          className="flex flex-col items-center justify-center rounded-xl p-3 text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut size={24} />
        </Button>
      </div>
    </>
  );
}
