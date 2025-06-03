import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isTokenValid()) {
          setIsAuthenticated(true);
        } else {
          // Thử làm mới token
          await authService.refreshToken();
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Lỗi xác thực:', error);
        authService.clearTokens();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 