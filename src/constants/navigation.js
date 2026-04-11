import { Home, User, Bell, Settings } from "lucide-react";

export const getNavigationLinks = (username) => [
  { path: "/", label: "Home", icon: Home, requiresBadge: false },
  { path: `/profile/${username}`, label: "Profile", icon: User, requiresBadge: false },
  { path: "/notification", label: "Notification", icon: Bell, requiresBadge: true },
  { path: "/settings", label: "Settings", icon: Settings, requiresBadge: false },
];
