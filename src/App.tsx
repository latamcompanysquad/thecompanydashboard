import { useState } from "react";
import { AdminVerificationGate } from "./components/AdminVerificationGate";
import { AdminDashboardClient } from "./components/AdminDashboardClient";

export default function App() {
  // Automatically start logged in during local development (npm run dev)
  const isDev = import.meta.env.DEV;
  const [isAuthorized, setIsAuthorized] = useState<boolean>(isDev);
  const [activeAdminName, setActiveAdminName] = useState<string>("noe_gt22");

  const handleSuccess = (staffUser?: any) => {
    if (staffUser && staffUser.lastName) {
      setActiveAdminName(staffUser.lastName.trim());
    }
    setIsAuthorized(true);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
  };

  if (!isAuthorized) {
    return <AdminVerificationGate adminName={activeAdminName} onSuccess={handleSuccess} />;
  }

  return <AdminDashboardClient adminName={activeAdminName} onLogout={handleLogout} />;
}
