import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ADMIN_PASSWORD_KEY = 'admin_unlock_password';
const DEFAULT_PASSWORD = 'dowslakers12';
const SESSION_KEY = 'adminUnlocked';

interface AdminSessionContextType {
  isUnlocked: boolean;
  unlock: () => void;
  lock: () => void;
  verifyPassword: (password: string) => boolean;
  updatePassword: (newPassword: string) => void;
}

const AdminSessionContext = createContext<AdminSessionContextType | undefined>(undefined);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check if admin was already unlocked in this session on mount
  useEffect(() => {
    const unlocked = sessionStorage.getItem(SESSION_KEY) === '1';
    setIsUnlocked(unlocked);
  }, []);

  const unlock = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setIsUnlocked(true);
  };

  const lock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsUnlocked(false);
  };

  const verifyPassword = (password: string): boolean => {
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
    return password === storedPassword;
  };

  const updatePassword = (newPassword: string) => {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
  };

  return (
    <AdminSessionContext.Provider value={{ isUnlocked, unlock, lock, verifyPassword, updatePassword }}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);
  if (!context) {
    throw new Error('useAdminSession must be used within an AdminSessionProvider');
  }
  return context;
}
