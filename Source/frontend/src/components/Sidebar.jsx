import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path) => {
    return `flex items-center px-4 py-2 text-sm font-medium rounded-md group ${
      isActive(path)
        ? 'text-white bg-gray-700'
        : 'text-gray-300 hover:text-white hover:bg-gray-700'
    }`;
  };

  const getIconClasses = (path) => {
    return `mr-3 ${
      isActive(path)
        ? 'text-white'
        : 'text-gray-400 group-hover:text-white'
    }`;
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-gray-800">
        <Link to="/dashboard" className="flex items-center justify-center h-16 px-4 bg-gray-900 hover:bg-gray-800">
          <div className="flex items-center">
            <i className="fas fa-fire text-red-500 text-2xl mr-2"></i>
            <span className="text-white font-semibold text-lg">Smart Home</span>
          </div>
        </Link>
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex-1 px-4 space-y-4">
            <nav className="flex-1 space-y-2">
              <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
                <i className={`fas fa-tachometer-alt ${getIconClasses('/dashboard')}`}></i>
                Bảng điều khiển
              </Link>
              <Link to="/analytics" className={getLinkClasses('/analytics')}>
                <i className={`fas fa-chart-line ${getIconClasses('/analytics')}`}></i>
                Phân tích
              </Link>
              <Link to="/config-limit" className={getLinkClasses('/config-limit')}>
                <i className={`fas fa-sliders-h ${getIconClasses('/config-limit')}`}></i>
                Cài đặt giới hạn
              </Link>
              <Link to="/settings" className={getLinkClasses('/settings')}>
                <i className={`fas fa-cog ${getIconClasses('/settings')}`}></i>
                Cài đặt chung
              </Link>
              <Link to="/alerts" className={getLinkClasses('/alerts')}>
                <i className={`fas fa-bell ${getIconClasses('/alerts')}`}></i>
                Cảnh báo
              </Link>
              {/* <Link to="/users" className={getLinkClasses('/users')}>
                <i className={`fas fa-users ${getIconClasses('/users')}`}></i>
                Người dùng
              </Link>
              <Link to="/reports" className={getLinkClasses('/reports')}>
                <i className={`fas fa-file-alt ${getIconClasses('/reports')}`}></i>
                Báo cáo
              </Link> */}
            </nav>
          </div>
          <div className="px-4 pb-4">
            <div className="bg-gray-700 rounded-md p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-shield-alt text-green-400 text-xl"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Trạng thái hệ thống</p>
                  <p className="text-xs text-gray-300">Tất cả cảm biến đang hoạt động</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 