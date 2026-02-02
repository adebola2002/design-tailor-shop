import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    if (token) {
      try {
        const userData = await api.getMe(token);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
      }
    }
  };

  useEffect(() => {
    // Check if token exists and fetch user
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            setToken(null);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.login({ email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: new Error(errorData.error || 'Registration failed') };
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const isAdmin = false; // Set to true for admin users if needed

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAdmin,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
