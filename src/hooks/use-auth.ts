import { useState, useEffect } from 'react';

const AUTH_KEY = 'mosjid_admin_auth';

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth === 'true') {
      setIsAdmin(true);
    }
    setIsChecking(false);
  }, []);

  const login = (password: string) => {
    if (password === 'admin123') {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAdmin(false);
  };

  return { isAdmin, isChecking, login, logout };
}
