import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types/admin';

interface AdminContextType {
  currentAdmin: AdminUser | null;
  loginAdmin: (user: AdminUser) => void;
  logoutAdmin: () => void;
  switchUser: (user: AdminUser) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'evolve_admin_user_session_v2';

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    try {
      if (currentAdmin) {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(currentAdmin));
      } else {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [currentAdmin]);

  const loginAdmin = (user: AdminUser) => {
    setCurrentAdmin(user);
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
  };

  const switchUser = (user: AdminUser) => {
    setCurrentAdmin(user);
  };

  return (
    <AdminContext.Provider
      value={{
        currentAdmin,
        loginAdmin,
        logoutAdmin,
        switchUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
