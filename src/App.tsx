import { useState, useEffect } from "react";
import { AdminVerificationGate } from "./components/AdminVerificationGate";
import { AdminDashboardClient } from "./components/AdminDashboardClient";

const LOCAL_STORAGE_KEY = "lc_admin_authorized";

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
  });

  useEffect(() => {
    if (isAuthorized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [isAuthorized]);

  const handleSuccess = () => {
    setIsAuthorized(true);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
  };

  if (!isAuthorized) {
    return <AdminVerificationGate adminName="Admin" onSuccess={handleSuccess} />;
  }

  return <AdminDashboardClient adminName="Admin" onLogout={handleLogout} />;
}
