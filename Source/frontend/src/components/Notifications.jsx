import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { warningService } from '../services/warningService';

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await warningService.getWarningLogs(5); // Lấy 5 cảnh báo gần nhất
      if (response.success) {
        setNotifications(response.data.logs);
      } else {
        setError(response.message || 'Không thể lấy thông báo');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi lấy thông báo');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const getWarningIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <FontAwesomeIcon icon={faTemperatureHigh} className="text-red-500" />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />;
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="p-1 text-gray-400 rounded-full focus:outline-none focus:ring-0 relative"
      >
        <i className="fas fa-bell"></i>
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Thông báo gần đây</h3>
          </div>

          {loading ? (
            <div className="px-4 py-3 text-center">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Không có thông báo mới
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {getWarningIcon(notification.type)}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.type === 'temperature' ? 'Cảnh báo nhiệt độ' : 'Cảnh báo khí gas'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Giá trị: {notification.value} {notification.unit}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(notification.created)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-4 py-2 border-t border-gray-200">
            <a
              href="/alerts"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Xem tất cả thông báo
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications; 