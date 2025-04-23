import React, { createContext, useState, useEffect } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import AuthService from '../service/auth';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AuthService.getToken();
        const userData = await EncryptedStorage.getItem('userData');
        if (token && userData) {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
          console.log('Auth status: Đã đăng nhập, user:', userData);
        } else {
          console.log('Auth status: Chưa đăng nhập');
        }
      } catch (error) {
        console.error('Lỗi kiểm tra trạng thái đăng nhập:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://192.168.1.2:15000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
      const { token, refreshToken, user } = data; // Giả định API trả về token, refreshToken, user
      await EncryptedStorage.setItem('token', token);
      await EncryptedStorage.setItem('refreshToken', refreshToken);
      await EncryptedStorage.setItem('userData', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      console.log('Đăng nhập thành công:', user);
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      setUser(null);
      console.log('Đăng xuất thành công');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      throw error;
    }
  };

  if (isLoading) {
    return null; // Hoặc hiển thị màn hình loading
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};