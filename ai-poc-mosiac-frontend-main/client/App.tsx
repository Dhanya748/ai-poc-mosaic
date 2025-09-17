import "./global.css";

import { createRoot } from "react-dom/client";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Enterprise from "./pages/Enterprise";
import ReportPage from "./pages/Report";
import InitroLanding from "./pages/InitroLanding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Setup from "./pages/Setup";
import Audience from "./pages/Audience";
import Sources from "./pages/Sources";
import Activations from "./pages/Activations";
import Profile from "./pages/Profile";
import ActivationHistory from "./pages/ActivationHistory";
import DashboardLayout from "./components/layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Import the new component
import QueryInterface from "./components/QueryInterface";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<InitroLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/consumer" element={<Index />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/report/:id" element={<ReportPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="setup" element={<Setup />} />
              <Route path="audience" element={<Audience />} />
              <Route path="sources" element={<Sources />} />
              <Route path="activations" element={<Activations />} />
              <Route path="activation-history" element={<ActivationHistory />} />
              <Route path="profile" element={<Profile />} />
              {/* Add the new route for the Query Interface */}
              <Route path="query" element={<QueryInterface />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

