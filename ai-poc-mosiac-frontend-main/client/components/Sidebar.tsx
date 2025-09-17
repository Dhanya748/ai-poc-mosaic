import type { FC, SVGProps } from "react";
import { NavLink } from "react-router-dom";

// Define Icon type locally for props
export type IconComponent = FC<SVGProps<SVGSVGElement>>;

// Ensure all props passed from DashboardLayout are listed here
interface SidebarProps {
  DashboardIcon: IconComponent;
  HomeIcon: IconComponent;
  AudienceIcon: IconComponent;
  SourceIcon: IconComponent;
  ActivationIcon: IconComponent;
  HistoryIcon: IconComponent;
}

// The local icon definitions are removed as we now get them from lucide-react via props.

const Sidebar: FC<SidebarProps> = ({ DashboardIcon, HomeIcon, AudienceIcon, SourceIcon, ActivationIcon, HistoryIcon }) => {
  const navItems = [
    { name: "Dashboard", icon: DashboardIcon, path: "/app" },
    { name: "Setup", icon: HomeIcon, path: "/app/setup" },
    { name: "Sources", icon: SourceIcon, path: "/app/sources" },
    { name: "Audience", icon: AudienceIcon, path: "/app/audience" },
    { name: "Activations", icon: ActivationIcon, path: "/app/activations" },
    { name: "Campaign History", icon: HistoryIcon, path: "/app/activation-history" },
  ];

  return (
    <aside className="hidden md:flex w-64 min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white flex-col">
      <div className="flex items-center space-x-2 border-b border-white/10 p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-bold text-purple-300">IA</div>
        <h1 className="text-xl font-bold">Mossic</h1>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/app"} // This ensures the Dashboard link is only active on exact match
            className={({ isActive }) =>
              `flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4 mt-auto">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500 font-bold">M</div>
          <div>
            <p className="text-sm font-semibold">Marketing User</p>
            <p className="text-xs text-gray-400">m.user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

