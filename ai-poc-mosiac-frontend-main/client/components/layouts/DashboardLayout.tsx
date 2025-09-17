import { FC } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
// Import the necessary icons from lucide-react
import { Home, Users, Database, Rocket, LogOut, LayoutGrid, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardLayout: FC = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    // Basic logout logic, you might want to clear more than just this
    localStorage.removeItem("initro_auth");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex">
      {/* Pass all the required icon props to the Sidebar component */}
      <Sidebar 
        DashboardIcon={LayoutGrid} 
        HomeIcon={Home} 
        AudienceIcon={Users} 
        SourceIcon={Database} 
        ActivationIcon={Rocket}
        HistoryIcon={History}
      />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end border-b bg-background/95 backdrop-blur px-4">
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:ml-2 sm:inline">Logout</span>
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
