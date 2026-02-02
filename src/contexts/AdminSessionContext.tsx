import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminSessionContextType {
  isUnlocked: boolean;
  unlock: () => void;
  lock: () => void;
}

const AdminSessionContext = createContext<AdminSessionContextType | undefined>(undefined);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check if admin was already unlocked in this session on mount
  useEffect(() => {
    const unlocked = sessionStorage.getItem('adminUnlocked') === '1';
    setIsUnlocked(unlocked);
  }, []);

  const unlock = () => {
    sessionStorage.setItem('adminUnlocked', '1');
    setIsUnlocked(true);
  };

  const lock = () => {
    sessionStorage.removeItem('adminUnlocked');
    setIsUnlocked(false);
  };

  return (
    <AdminSessionContext.Provider value={{ isUnlocked, unlock, lock }}>
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
