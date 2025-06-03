import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Notifications from './Notifications';

const TopNavigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoggingOut(true);
    
    try {
      // Xóa tất cả dữ liệu liên quan đến xác thực
      localStorage.clear(); // Xóa toàn bộ localStorage
      sessionStorage.clear(); // Xóa toàn bộ sessionStorage
      
      // Đóng dropdown menu
      setIsDropdownOpen(false);
      
      // Chuyển về trang đăng nhập ngay lập tức
      window.location.href = '/login';
    } catch (error) {
      console.error('Lỗi trong quá trình đăng xuất:', error);
      // Nếu có lỗi, vẫn cố gắng chuyển về trang đăng nhập
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      {/* Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-gray-700 font-medium">Đang đăng xuất...</p>
          </div>
        </div>
      )}

      <div className="flex items-center">
        <button className="text-gray-500 focus:outline-none md:hidden">
          <i className="fas fa-bars"></i>
        </button>
        <div className="relative mx-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input 
            type="text" 
            className="block w-full py-2 pl-10 pr-3 text-sm bg-gray-100 border border-transparent rounded-md focus:bg-white focus:border-gray-300 focus:outline-none" 
            placeholder="Tìm kiếm..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Notifications />
        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center focus:outline-none hover:bg-gray-50 px-2 py-1 rounded-md transition-colors duration-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img 
              className="w-8 h-8 rounded-full ring-2 ring-gray-100" 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Ảnh đại diện người dùng"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Quản trị viên</span>
            <i className={`ml-1 fas fa-chevron-down text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}></i>
          </button>

          {/* Menu thả xuống */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Đang đăng xuất...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Đăng xuất
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavigation; 