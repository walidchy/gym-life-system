
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

// Admin pages
import Members from "./pages/admin/Members";
import Trainers from "./pages/admin/Trainers";
import Activities from "./pages/admin/Activities";
import Memberships from "./pages/admin/Memberships";
import Equipment from "./pages/admin/Equipment";
import Settings from "./pages/admin/Settings";

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Admin routes */}
              <Route path="/admin/members" element={<Members />} />
              <Route path="/admin/trainers" element={<Trainers />} />
              <Route path="/admin/activities" element={<Activities />} />
              <Route path="/admin/memberships" element={<Memberships />} />
              <Route path="/admin/equipment" element={<Equipment />} />
              <Route path="/admin/settings" element={<Settings />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
