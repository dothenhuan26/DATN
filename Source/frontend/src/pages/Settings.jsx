import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import DashboardLayout from '../layouts/DashboardLayout';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    security: {
      twoFactor: false,
      autoLock: true,
      geoFencing: false,
    },
    automation: {
      nightMode: true,
      morningRoutine: false,
      energySaving: true,
    },
    devices: {
      autoDetect: true,
      offlineAlerts: true,
      maintenance: false,
    }
  });

  const handleSettingChange = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const SettingToggle = ({ category, setting, label, description }) => (
    <div className="flex items-center justify-between py-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch
        checked={settings[category][setting]}
        onChange={() => handleSettingChange(category, setting)}
        className={`${
          settings[category][setting] ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`${
            settings[category][setting] ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );

  const SettingSection = ({ title, category, items }) => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <SettingToggle
            key={index}
            category={category}
            setting={item.key}
            label={item.label}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );

  const settingsContent = (
    <div className="p-6 py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Cài đặt hệ thống
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <SettingSection
            title="Thông báo"
            category="notifications"
            items={[
              {
                key: 'email',
                label: 'Thông báo qua Email',
                description: 'Nhận thông báo qua địa chỉ email đã đăng ký'
              },
              {
                key: 'push',
                label: 'Thông báo đẩy',
                description: 'Nhận thông báo trực tiếp trên thiết bị'
              },
              {
                key: 'sms',
                label: 'Thông báo SMS',
                description: 'Nhận thông báo qua tin nhắn SMS'
              }
            ]}
          />

          <SettingSection
            title="Bảo mật"
            category="security"
            items={[
              {
                key: 'twoFactor',
                label: 'Xác thực 2 lớp',
                description: 'Bảo vệ tài khoản bằng xác thực hai lớp'
              },
              {
                key: 'autoLock',
                label: 'Tự động khóa',
                description: 'Tự động khóa thiết bị sau thời gian không hoạt động'
              },
              {
                key: 'geoFencing',
                label: 'Định vị địa lý',
                description: 'Tự động điều chỉnh dựa trên vị trí của bạn'
              }
            ]}
          />

          <SettingSection
            title="Tự động hóa"
            category="automation"
            items={[
              {
                key: 'nightMode',
                label: 'Chế độ ban đêm',
                description: 'Tự động kích hoạt chế độ ban đêm theo giờ'
              },
              {
                key: 'morningRoutine',
                label: 'Lịch trình buổi sáng',
                description: 'Tự động kích hoạt các thiết bị vào buổi sáng'
              },
              {
                key: 'energySaving',
                label: 'Tiết kiệm năng lượng',
                description: 'Tối ưu hóa việc sử dụng năng lượng'
              }
            ]}
          />

          <SettingSection
            title="Thiết bị"
            category="devices"
            items={[
              {
                key: 'autoDetect',
                label: 'Tự động phát hiện',
                description: 'Tự động phát hiện thiết bị mới trong mạng'
              },
              {
                key: 'offlineAlerts',
                label: 'Cảnh báo ngoại tuyến',
                description: 'Thông báo khi thiết bị mất kết nối'
              },
              {
                key: 'maintenance',
                label: 'Bảo trì tự động',
                description: 'Tự động cập nhật và bảo trì thiết bị'
              }
            ]}
          />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {settingsContent}
    </DashboardLayout>
  );
};

export default Settings; 