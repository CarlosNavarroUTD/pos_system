// AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from './AuthService';
import TokenService from './tokenService';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!TokenService.getAccessToken());

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (TokenService.getAccessToken()) {
        try {
          const user = await AuthService.getCurrentUser();
          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          setCurrentUser(null);
          setIsAuthenticated(false);
          TokenService.removeTokens();
        }
      }
    };
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
