import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('geoaddress_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - check against "registered" users
    const users = JSON.parse(localStorage.getItem('geoaddress_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        phone: foundUser.phone,
      };
      setUser(userData);
      localStorage.setItem('geoaddress_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('geoaddress_users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    };
    
    users.push(newUser);
    localStorage.setItem('geoaddress_users', JSON.stringify(users));
    
    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
    
    setUser(userData);
    localStorage.setItem('geoaddress_user', JSON.stringify(userData));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('geoaddress_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};