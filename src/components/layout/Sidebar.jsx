import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/user/userSlice";
import { getNavigationLinks } from "../../constants/navigation";
import Button from "../ui/Button";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { signOut } = useAuth();
  const { currentUser } = useSelector((state) => state.user);
  const { unreadCount } = useSelector((state) => state.notifications);

  const navLinkStyles = ({ isActive }) =>
    `flex items-center text-text-primary gap-3 p-3 text-lg font-bold rounded-xl transition-all duration-200 ${
      isActive ? "bg-slate-800 shadow-sm" : "flex hover:bg-slate-800/50"
    }`;

  return (
    <div className="bg-sidebar fixed top-0 left-0 hidden h-screen w-74 flex-col items-start justify-between border-r border-slate-700 p-6 lg:flex">
      <div className="w-full">
        <div className="mb-8 w-full">
          <h1 className="block bg-linear-to-r from-[#D0BCFF] to-[#D0BCFF] bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl">
            DevConnect
          </h1>
        </div>
        <nav>
          {getNavigationLinks(currentUser?.username).map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.path} to={link.path} className={navLinkStyles}>
                {link.requiresBadge ? (
                  <div className="relative flex items-center justify-center">
                    <Icon />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                ) : (
                  <Icon />
                )}
                {link.label}
              </NavLink>
            );
          })}
          <Button
            className="flex w-full items-center justify-start gap-3 rounded-xl p-3 text-lg font-bold text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500"
            onClick={() => {
              signOut();
              dispatch(logoutUser());
            }}
          >
            <>
              <LogOut /> Logout
            </>
          </Button>
        </nav>
      </div>
    </div>
  );
}
