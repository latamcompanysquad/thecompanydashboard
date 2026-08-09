import { useState, useEffect } from "react";
import { AdminVerificationGate } from "./components/AdminVerificationGate";
import { AdminDashboardClient } from "./components/AdminDashboardClient";

const LOCAL_STORAGE_KEY = "lc_admin_authorized";

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
  });
  const [activeAdminName, setActiveAdminName] = useState<string>(() => {
    return localStorage.getItem("lc_admin_name") || "noe_gt22";
  });

  useEffect(() => {
    if (isAuthorized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, "true");
      localStorage.setItem("lc_admin_name", activeAdminName);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem("lc_admin_name");
    }
  }, [isAuthorized, activeAdminName]);

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
