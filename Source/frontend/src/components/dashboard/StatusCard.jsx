import React from 'react';

const StatusCard = ({ title, value, unit, trend, trendValue, gaugeValue, gaugeColor, isAlert }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${isAlert ? 'alert-pulse' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`mt-1 text-2xl font-semibold ${isAlert ? 'text-red-600' : 'text-gray-900'}`}>
            {value} <span className="text-sm text-gray-500">{unit}</span>
          </p>
          <p className={`mt-1 text-sm ${trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
            {trend === 'up' ? (
              <i className="fas fa-arrow-up mr-1"></i>
            ) : (
              <i className="fas fa-check-circle mr-1"></i>
            )}
            {trendValue}
          </p>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={`var(--tw-${gaugeColor}-500)`}
              strokeWidth="3"
              strokeDasharray={`${gaugeValue * 100}, 100`}
              className="transition-all duration-500 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">{Math.round(gaugeValue * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard; 