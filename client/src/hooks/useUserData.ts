import { useCallback } from 'react';

interface UserData {
  _id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  message: string;
  user: UserData;
  token: string;
}

export const useAuth = () => {
  const setUserData = useCallback((loginResponse: LoginResponse) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(loginResponse.user));
      localStorage.setItem('token', loginResponse.token);
    }
  }, []);

  const getUserData = useCallback((): UserData | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      return userData ? (JSON.parse(userData) as UserData) : null;
    }
    return null;
  }, []);

  const getToken = useCallback((): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }, []);

  const clearUserData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      window.location.reload();
    }
  }, []);

  return {
    setUserData,
    getUserData,
    getToken,
    clearUserData,
  };
};
