import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { configLimitService } from '../services/configLimitService';
import { toast } from 'react-toastify';
import '../styles/input.css';
import { Line } from 'react-chartjs-2';
import { getGasSensorTopLogs, getTemperatureSensorTopLogs } from '../services/api';

const ConfigLimit = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState(null);
  const [inputError, setInputError] = useState('');
  const [gasChartData, setGasChartData] = useState(null);
  const [tempChartData, setTempChartData] = useState(null);

  useEffect(() => {
    fetchConfigs();
    fetchChartData();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await configLimitService.getAllConfigs();
      if (response.success) {
        setConfigs(response.data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu cấu hình');
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      // Lấy dữ liệu cảm biến khí gas từ API mới
      const gasResponse = await getGasSensorTopLogs();
      if (gasResponse.success) {
        const gasLogs = gasResponse.data.logs;
        setGasChartData({
          labels: gasLogs.map(log => new Date(log.created).toLocaleTimeString()),
          datasets: [{
            label: 'Nồng độ khí gas (ppm)',
            data: gasLogs.map(log => log.concentrations),
            borderColor: '#EAB308',
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            fill: true,
            tension: 0.4
          }]
        });
      }

      // Lấy dữ liệu cảm biến nhiệt độ từ API mới
      const tempResponse = await getTemperatureSensorTopLogs();
      if (tempResponse.success) {
        const tempLogs = tempResponse.data.logs;
        setTempChartData({
          labels: tempLogs.map(log => new Date(log.created).toLocaleTimeString()),
          datasets: [{
            label: 'Nhiệt độ (°C)',
            data: tempLogs.map(log => log.temperature),
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
          }]
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu biểu đồ:', error);
      toast.error('Không thể tải dữ liệu biểu đồ');
    }
  };

  const handleEditClick = (config) => {
    setEditingConfig({
      ...config,
      value: config.value.toString()
    });
    setInputError('');
  };

  const validateInput = (value, type) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'Vui lòng nhập một số hợp lệ';
    }

    if (type === 'MQ2') {
      if (numValue < 0 || numValue > 10000) {
        return 'Giá trị nồng độ khí gas phải từ 0 đến 10000 ppm';
      }
    } else if (type === 'DHT11') {
      if (numValue < -20 || numValue > 100) {
        return 'Nhiệt độ phải từ -20°C đến 100°C';
      }
    }
    return '';
  };

  const handleSave = async () => {
    const error = validateInput(editingConfig.value, editingConfig.type);
    if (error) {
      setInputError(error);
      return;
    }

    try {
      const response = await configLimitService.updateConfig({
        ...editingConfig,
        value: parseFloat(editingConfig.value)
      });
      if (response.success) {
        toast.success(response.message);
        setEditingConfig(null);
        setInputError('');
        fetchConfigs();
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật cấu hình');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingConfig(prev => ({
      ...prev,
      [name]: value
    }));
    setInputError(validateInput(value, editingConfig.type));
  };

  const getUnitLabel = (unit) => {
    switch (unit) {
      case 'concentration':
        return 'ppm';
      case 'celsius':
        return '°C';
      default:
        return unit;
    }
  };

  const getSensorName = (type) => {
    switch (type) {
      case 'MQ2':
        return 'Cảm biến khí gas (MQ2)';
      case 'DHT11':
        return 'Cảm biến nhiệt độ (DHT11)';
      default:
        return type;
    }
  };

  const getThresholdDescription = (type) => {
    switch (type) {
      case 'MQ2':
        return 'Cảnh báo khi nồng độ khí gas vượt quá giới hạn này';
      case 'DHT11':
        return 'Cảnh báo khi nhiệt độ vượt quá giới hạn này';
      default:
        return '';
    }
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Không có dữ liệu';
      }
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Không có dữ liệu';
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#000000'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff'
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#000000'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#000000'
        }
      }
    }
  };

  const renderConfigCard = (config) => {
    const isEditing = editingConfig?.id === config.id;

    const getCardIcon = (type) => {
      switch (type) {
        case 'MQ2':
          return 'fas fa-smog text-yellow-500 text-3xl';
        case 'DHT11':
          return 'fas fa-temperature-high text-red-500 text-3xl';
        default:
          return 'fas fa-microchip text-blue-500 text-3xl';
      }
    };

    return (
      <div key={config.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex-1">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <i className={getCardIcon(config.type)}></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getSensorName(config.type)}
                </h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <i className="fas fa-microchip mr-2 text-gray-400"></i>
                  ID Thiết bị: {config.device_id}
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => handleEditClick(config)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="fas fa-edit mr-2"></i>
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị giới hạn
                </label>
                <div className="relative mt-2">
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="value"
                      value={editingConfig.value}
                      onChange={handleInputChange}
                      className={`
                        block w-full px-4 py-3 pr-12
                        text-base
                        border-2 rounded-lg
                        transition-colors duration-200
                        outline-none
                        ${inputError
                          ? 'border-red-300 bg-red-50 text-white placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-200 bg-gray-800 text-white placeholder-gray-400 hover:border-gray-300 focus:border-blue-500'
                        }
                        focus:ring-2 focus:ring-offset-2 ${inputError ? 'focus:ring-red-200' : 'focus:ring-blue-200'}
                      `}
                      placeholder={`Nhập giá trị ${config.type === 'MQ2' ? 'nồng độ' : 'nhiệt độ'}`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <div className="flex items-center justify-center h-full px-4 py-2 text-sm text-white bg-gray-700 border-l border-gray-600 rounded-r-lg">
                        {getUnitLabel(config.unit)}
                      </div>
                    </div>
                  </div>
                  {inputError && (
                    <div className="absolute inset-y-0 right-12 flex items-center pr-3 pointer-events-none">
                      <i className="fas fa-exclamation-circle text-red-500"></i>
                    </div>
                  )}
                </div>
                {inputError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {inputError}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500 flex items-center">
                  <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                  {getThresholdDescription(config.type)}
                </p>
                {config.type === 'MQ2' && (
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <div className="flex items-center mr-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span>An toàn: &lt; 500 ppm</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                      <span>Cảnh báo: 500-1000 ppm</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      <span>Nguy hiểm: &gt; 1000 ppm</span>
                    </div>
                  </div>
                )}
                {config.type === 'DHT11' && (
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <div className="flex items-center mr-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span>An toàn: 18-30°C</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                      <span>Chú ý: 30-40°C</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      <span>Nguy hiểm: &gt; 40°C</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setEditingConfig(null);
                    setInputError('');
                  }}
                  className="inline-flex items-center px-4 py-2 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-200"
                >
                  <i className="fas fa-times mr-2"></i>
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={!!inputError}
                  className={`
                    inline-flex items-center px-4 py-2 border-2 text-sm font-medium rounded-lg shadow-sm
                    transition-all duration-200
                    ${inputError
                      ? 'border-blue-200 bg-blue-100 text-blue-400 cursor-not-allowed'
                      : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }
                  `}
                >
                  <i className="fas fa-save mr-2"></i>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-lg ${config.type === 'MQ2' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                  <span className="text-3xl font-bold text-gray-900">
                    {config.value}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    {getUnitLabel(config.unit)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    {getThresholdDescription(config.type)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <i className="far fa-clock mr-2"></i>
                    Cập nhật lần cuối: {formatDateTime(config.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div>
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Cài đặt giới hạn cảm biến
              </h2>
              <p className="mt-1 text-sm text-gray-900">
                Quản lý ngưỡng cảnh báo cho các cảm biến trong hệ thống
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {configs.map(renderConfigCard)}
              </div>

              <div className="mt-12 space-y-8">
                {/* Phần MQ2 */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <i className="fas fa-smog mr-3"></i>
                      Cảm biến khí gas MQ2
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông số kỹ thuật</h4>
                        <ul className="space-y-3 text-gray-900">
                          <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>Phạm vi đo: 0 - 10000 ppm</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>Độ chính xác: ±5% FS</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>Thời gian đáp ứng: &lt; 10 giây</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>Điện áp hoạt động: 5V DC</span>
                          </li>
                        </ul>

                        <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Ngưỡng cảnh báo</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-green-600">An toàn (&lt; 500 ppm)</p>
                            <p className="text-sm text-gray-900">Nồng độ khí gas trong môi trường bình thường</p>
                          </div>
                          <div>
                            <p className="font-medium text-yellow-600">Cảnh báo (500 - 1000 ppm)</p>
                            <p className="text-sm text-gray-900">Nồng độ khí gas cao, cần kiểm tra</p>
                          </div>
                          <div>
                            <p className="font-medium text-red-600">Nguy hiểm (&gt; 1000 ppm)</p>
                            <p className="text-sm text-gray-900">Nồng độ khí gas rất cao, cần sơ tán ngay lập tức</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="h-64 mb-4">
                          {gasChartData && (
                            <Line data={gasChartData} options={chartOptions} />
                          )}
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Lưu ý quan trọng</h4>
                          <ul className="space-y-2 text-gray-900">
                            <li className="flex items-start">
                              <i className="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-2"></i>
                              <span>Cần thời gian khởi động 24-48 giờ cho lần đầu sử dụng</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-2"></i>
                              <span>Tránh môi trường có độ ẩm cao &gt; 95% RH</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-2"></i>
                              <span>Kiểm tra và hiệu chuẩn định kỳ 6 tháng/lần</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phần DHT11 */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <i className="fas fa-temperature-high mr-3"></i>
                      Cảm biến nhiệt độ DHT11
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông số kỹ thuật</h4>
                        <ul className="space-y-3 text-gray-900">
                          <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>Phạm vi đo nhiệt độ: -20°C đến 100°C</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>Độ chính xác nhiệt độ: ±2°C</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>Thời gian đáp ứng: 6-30 giây</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                            <span>Điện áp hoạt động: 3.3-5.5V DC</span>
                          </li>
                        </ul>

                        <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Ngưỡng cảnh báo nhiệt độ</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-green-600">An toàn (18-30°C)</p>
                            <p className="text-sm text-gray-900">Nhiệt độ môi trường lý tưởng</p>
                          </div>
                          <div>
                            <p className="font-medium text-yellow-600">Chú ý (30-40°C)</p>
                            <p className="text-sm text-gray-900">Nhiệt độ cao, cần kiểm tra</p>
                          </div>
                          <div>
                            <p className="font-medium text-red-600">Nguy hiểm (&gt; 40°C)</p>
                            <p className="text-sm text-gray-900">Nhiệt độ quá cao, cần xử lý ngay</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="h-64 mb-4">
                          {tempChartData && (
                            <Line data={tempChartData} options={chartOptions} />
                          )}
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Lưu ý quan trọng</h4>
                          <ul className="space-y-2 text-gray-900">
                            <li className="flex items-start">
                              <i className="fas fa-exclamation-triangle text-red-600 mt-1 mr-2"></i>
                              <span>Đặt cảm biến cách xa nguồn nhiệt trực tiếp</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-exclamation-triangle text-red-600 mt-1 mr-2"></i>
                              <span>Tránh ánh nắng mặt trời chiếu trực tiếp</span>
                            </li>
                            <li className="flex items-start">
                              <i className="fas fa-exclamation-triangle text-red-600 mt-1 mr-2"></i>
                              <span>Kiểm tra định kỳ 3 tháng/lần</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConfigLimit;

<style>
  {`
  /* Remove number input spinners */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`}
</style> 