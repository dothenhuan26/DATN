import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import loginBg from '../assets/login-bg.jpg';
import { authService } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { username, password, rememberMe } = formData;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isTokenValid()) {
          navigate('/dashboard');
        } else {
          // Try to refresh token
          await authService.refreshToken();
          navigate('/dashboard');
        }
      } catch (error) {
        // Token is invalid and refresh failed, stay on login page
        console.error('Lỗi xác thực:', error);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Vui lòng nhập tài khoản';
    }
    if (!password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setAlert(null);

    try {
      await authService.login(username, password, rememberMe);
      navigate('/dashboard');
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-gray-700 font-medium">Đang đăng nhập...</p>
          </div>
        </div>
      )}

      {/* Left side - Background Image */}
      <div 
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      />

      {/* Right side - Login Form */}
      <div 
        className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: 'linear-gradient(to top, #5800FF, #087fd4)'
        }}
      >
        <div className="max-w-md w-full space-y-8">
          {alert && (
            <div className={`p-4 rounded-md ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {alert.message}
            </div>
          )}

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Xin chào!</h1>
            <p className="text-gray-200">Đăng nhập để tiếp tục</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-4">
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm`}
                  placeholder="Tài khoản"
                  value={username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`appearance-none relative block w-full px-3 py-3 pl-10 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm`}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FontAwesomeIcon icon={faLock} />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-white focus:ring-white border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-white">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div>
                <Link to="/forgot-password" className="font-medium text-white hover:text-gray-200">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Đang đăng nhập...
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 