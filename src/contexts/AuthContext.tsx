import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'partner' | 'manager' | 'rep';
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, portal: 'admin' | 'partner') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  portal: 'admin' | 'partner' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers = {
  admin: {
    id: 'admin-1',
    email: 'admin@synkcrm.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    role: 'admin' as const,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    permissions: ['manage_integrations', 'view_analytics', 'manage_users', 'system_settings'],
    lastLogin: new Date().toISOString()
  },
  partner: {
    id: 'partner-1',
    email: 'sarah@reppartner.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'partner' as const,
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
    permissions: ['view_opportunities', 'manage_campaigns', 'view_reports'],
    lastLogin: new Date().toISOString()
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [portal, setPortal] = useState<'admin' | 'partner' | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('synkcrm_user');
    const savedPortal = localStorage.getItem('synkcrm_portal');
    
    if (savedUser && savedPortal) {
      setUser(JSON.parse(savedUser));
      setPortal(savedPortal as 'admin' | 'partner');
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, selectedPortal: 'admin' | 'partner'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = selectedPortal === 'admin' ? mockUsers.admin : mockUsers.partner;
    
    if (email === mockUser.email && password === 'password') {
      setUser(mockUser);
      setPortal(selectedPortal);
      localStorage.setItem('synkcrm_user', JSON.stringify(mockUser));
      localStorage.setItem('synkcrm_portal', selectedPortal);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setPortal(null);
    localStorage.removeItem('synkcrm_user');
    localStorage.removeItem('synkcrm_portal');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, portal }}>
      {children}
    </AuthContext.Provider>
  );
};