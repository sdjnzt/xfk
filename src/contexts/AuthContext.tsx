import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserInfo {
  username: string;
  role: string;
  name: string;
  loginTime: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // 检查本地存储中的登录状态
    const storedLoginState = localStorage.getItem('isLoggedIn');
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (storedLoginState === 'true' && storedUserInfo) {
      try {
        const user = JSON.parse(storedUserInfo);
        setIsLoggedIn(true);
        setUserInfo(user);
      } catch (error) {
        // 如果解析失败，清除存储的数据
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userInfo');
      }
    }
  }, []);

  const login = (userInfo: UserInfo) => {
    setIsLoggedIn(true);
    setUserInfo(userInfo);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
  };

  const value: AuthContextType = {
    isLoggedIn,
    userInfo,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
