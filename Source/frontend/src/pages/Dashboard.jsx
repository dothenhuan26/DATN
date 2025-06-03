import React, { useEffect, useRef, useState, useCallback } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Chart from 'chart.js/auto';
import mqtt from 'mqtt';

const MQTT_BROKER = 'wss://ecbb44930f454ccd863c43a1ce285a91.s1.eu.hivemq.cloud:8884/mqtt';
const MQTT_OPTIONS = {
  username: 'smartHome1',
  password: 'deviceSmartHome1',
  clientId: `react_${Math.random().toString(16).slice(3)}`,
  clean: true,
  rejectUnauthorized: false
};

const MAX_DATA_POINTS = 50;

// Common chart options
const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 800,
    easing: 'easeInOutQuart',
    x: {
      type: 'number',
      easing: 'linear',
      duration: 800,
      from: NaN,
      delay: 0
    },
    y: {
      type: 'number',
      easing: 'easeInOutQuart',
      duration: 800,
      from: NaN,
      delay: 0
    }
  },
  transitions: {
    active: {
      animation: {
        duration: 300
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      animation: {
        duration: 150
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#4b5563',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      usePointStyle: true,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(1);
            if (label.includes('Nồng độ')) {
              label += ' ppm';
            } else if (label.includes('Nhiệt độ')) {
              label += ' °C';
            } else if (label.includes('Độ ẩm')) {
              label += ' %';
            }
          }
          return label;
        }
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2,
      fill: true
    },
    point: {
      hitRadius: 10,
      hoverRadius: 6,
      radius: 3,
      borderWidth: 2
    }
  },
  layout: {
    padding: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    }
  },
  hover: {
    mode: 'nearest',
    intersect: false,
    animationDuration: 150
  }
};

// Chart configuration
const chartConfig = {
  gas: {
    type: 'line',
    options: {
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 1000,
          title: {
            display: true,
            text: 'Nồng độ (ppm)',
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11
            },
            padding: 8
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 10,
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            font: {
              size: 11
            },
            padding: 8
          }
        }
      }
    },
    dataset: {
      label: 'Nồng độ khí (ppm)',
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#2563eb',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      pointStyle: 'circle'
    }
  },
  tempHumidity: {
    type: 'line',
    options: {
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Nhiệt độ (°C)',
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11
            },
            padding: 8
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Độ ẩm (%)',
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          grid: {
            drawOnChartArea: false,
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11
            },
            padding: 8
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 10,
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            font: {
              size: 11
            },
            padding: 8
          }
        }
      }
    },
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#f97316',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#ea580c',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointStyle: 'circle',
        yAxisID: 'y'
      },
      {
        label: 'Độ ẩm (%)',
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#0891b2',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        pointStyle: 'circle',
        yAxisID: 'y1'
      }
    ]
  }
};

const Dashboard = () => {
  // Refs
  const gasChartRef = useRef(null);
  const tempHumidityChartRef = useRef(null);
  const gasChartInstance = useRef(null);
  const tempHumidityChartInstance = useRef(null);
  const animationFrameRef = useRef(null);

  // State
  const [sensorData, setSensorData] = useState({
    gas: { logs: [], current: 0 },
    tempHumidity: { logs: [], current: { temp: 0, humidity: 0 } }
  });
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Format time helper
  const formatTime = useCallback((isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, []);

  // Update chart data helper
  const updateChartData = useCallback((chart, newData) => {
    if (!chart) return;
    chart.data = newData;
    chart.update('none');
  }, []);

  // Initialize charts
  useEffect(() => {
    if (!gasChartRef.current || !tempHumidityChartRef.current) return;

    // Gas Chart
    const gasCtx = gasChartRef.current.getContext('2d');
    if (gasChartInstance.current) {
      gasChartInstance.current.destroy();
    }

    gasChartInstance.current = new Chart(gasCtx, {
      type: chartConfig.gas.type,
      data: {
        labels: [],
        datasets: [{ ...chartConfig.gas.dataset, data: [] }]
      },
      options: { ...commonChartOptions, ...chartConfig.gas.options }
    });

    // Temperature & Humidity Chart
    const tempHumidityCtx = tempHumidityChartRef.current.getContext('2d');
    if (tempHumidityChartInstance.current) {
      tempHumidityChartInstance.current.destroy();
    }

    tempHumidityChartInstance.current = new Chart(tempHumidityCtx, {
      type: chartConfig.tempHumidity.type,
      data: {
        labels: [],
        datasets: chartConfig.tempHumidity.datasets.map(dataset => ({ ...dataset, data: [] }))
      },
      options: { ...commonChartOptions, ...chartConfig.tempHumidity.options }
    });

    return () => {
      if (gasChartInstance.current) gasChartInstance.current.destroy();
      if (tempHumidityChartInstance.current) tempHumidityChartInstance.current.destroy();
    };
  }, []);

  // MQTT connection and data handling
  useEffect(() => {
    console.log('Đang khởi tạo kết nối MQTT...');
    console.log('URL MQTT Broker:', MQTT_BROKER);
    console.log('Tùy chọn MQTT:', { ...MQTT_OPTIONS, password: '****' });

    const client = mqtt.connect(MQTT_BROKER, MQTT_OPTIONS);

    client.on('connect', () => {
      console.log('✅ Kết nối MQTT broker thành công');
      setConnectionStatus('connected');

      console.log('Đang đăng ký nhận dữ liệu từ các topics...');
      client.subscribe(['esp8266_data_temperature_sensor', 'esp8266_data_gas_sensor'], (err) => {
        if (err) {
          console.error('❌ Lỗi đăng ký nhận dữ liệu:', err);
        } else {
          console.log('✅ Đăng ký nhận dữ liệu thành công từ các topics:');
          console.log('- esp8266_data_temperature_sensor');
          console.log('- esp8266_data_gas_sensor');
        }
      });
    });

    client.on('message', (topic, message) => {
      console.log(`📥 Nhận dữ liệu từ topic: ${topic}`);
      console.log('Dữ liệu thô:', message.toString());

      try {
        const data = JSON.parse(message.toString());
        console.log('Dữ liệu đã xử lý:', data);
        const timestamp = new Date().toISOString();

        if (topic === 'esp8266_data_temperature_sensor') {
          // Xử lý giá trị null hoặc undefined và giới hạn giá trị hiển thị
          const temperature = Math.min(data.temperature ?? 0, 100);
          const humidity = Math.min(data.humidity ?? 0, 100);

          console.log('🌡️ Đang xử lý dữ liệu nhiệt độ:', {
            nhiệt_độ: temperature,
            độ_ẩm: humidity,
            tên_thiết_bị: data.device_name ?? 'Unknown',
            mã_thiết_bị: data.device_id ?? 'Unknown',
            thời_gian: timestamp
          });

          setSensorData(prev => ({
            ...prev,
            tempHumidity: {
              logs: [...prev.tempHumidity.logs, {
                id: Date.now(),
                device_id: data.device_id ?? 'Unknown',
                device_name: data.device_name ?? 'Unknown',
                site_id: data.site_id ?? 'Unknown',
                temperature: temperature,
                humidity: humidity,
                created: timestamp
              }].slice(-MAX_DATA_POINTS),
              current: { temp: temperature, humidity: humidity }
            }
          }));
        } else if (topic === 'esp8266_data_gas_sensor') {
          // Xử lý giá trị null hoặc undefined và giới hạn giá trị hiển thị
          const concentrations = Math.min(data.concentrations ?? 0, 1000);

          console.log('💨 Đang xử lý dữ liệu khí:', {
            nồng_độ: concentrations,
            tên_thiết_bị: data.device_name ?? 'Unknown',
            mã_thiết_bị: data.device_id ?? 'Unknown',
            thời_gian: timestamp
          });

          setSensorData(prev => ({
            ...prev,
            gas: {
              logs: [...prev.gas.logs, {
                id: Date.now(),
                device_id: data.device_id ?? 'Unknown',
                device_name: data.device_name ?? 'Unknown',
                site_id: data.site_id ?? 'Unknown',
                concentrations: concentrations,
                created: timestamp
              }].slice(-MAX_DATA_POINTS),
              current: concentrations
            }
          }));
        }
      } catch (error) {
        console.error('❌ Lỗi xử lý dữ liệu:', error);
        console.error('Dữ liệu gây lỗi:', message.toString());

        // Xử lý khi message không phải JSON hợp lệ
        const timestamp = new Date().toISOString();
        if (topic === 'esp8266_data_temperature_sensor') {
          setSensorData(prev => ({
            ...prev,
            tempHumidity: {
              logs: [...prev.tempHumidity.logs, {
                id: Date.now(),
                device_id: 'Unknown',
                device_name: 'Unknown',
                site_id: 'Unknown',
                temperature: 0,
                humidity: 0,
                created: timestamp
              }].slice(-MAX_DATA_POINTS),
              current: { temp: 0, humidity: 0 }
            }
          }));
        } else if (topic === 'esp8266_data_gas_sensor') {
          setSensorData(prev => ({
            ...prev,
            gas: {
              logs: [...prev.gas.logs, {
                id: Date.now(),
                device_id: 'Unknown',
                device_name: 'Unknown',
                site_id: 'Unknown',
                concentrations: 0,
                created: timestamp
              }].slice(-MAX_DATA_POINTS),
              current: 0
            }
          }));
        }
      }
    });

    client.on('error', (error) => {
      console.error('❌ Lỗi MQTT:', error);
      setConnectionStatus('error');
    });

    client.on('close', () => {
      console.log('🔌 Mất kết nối với MQTT broker');
      setConnectionStatus('disconnected');
    });

    client.on('reconnect', () => {
      console.log('🔄 Đang thử kết nối lại với MQTT broker...');
    });

    client.on('offline', () => {
      console.log('📴 Mất kết nối MQTT');
      setConnectionStatus('disconnected');
    });

    return () => {
      console.log('🧹 Đang dọn dẹp kết nối MQTT...');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      client.end();
    };
  }, []);

  // Update charts when data changes
  useEffect(() => {
    if (gasChartInstance.current && sensorData.gas.logs.length > 0) {
      const gasChartData = {
        labels: sensorData.gas.logs.map(log => formatTime(log.created)),
        datasets: [{
          ...chartConfig.gas.dataset,
          data: sensorData.gas.logs.map(log => log.concentrations)
        }]
      };
      updateChartData(gasChartInstance.current, gasChartData);
    }

    if (tempHumidityChartInstance.current && sensorData.tempHumidity.logs.length > 0) {
      const tempHumidityChartData = {
        labels: sensorData.tempHumidity.logs.map(log => formatTime(log.created)),
        datasets: [
          {
            ...chartConfig.tempHumidity.datasets[0],
            data: sensorData.tempHumidity.logs.map(log => log.temperature)
          },
          {
            ...chartConfig.tempHumidity.datasets[1],
            data: sensorData.tempHumidity.logs.map(log => log.humidity)
          }
        ]
      };
      updateChartData(tempHumidityChartInstance.current, tempHumidityChartData);
    }
  }, [sensorData, formatTime, updateChartData]);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Giám sát môi trường</h1>
          <p className="text-gray-600">Theo dõi nồng độ khí, nhiệt độ và độ ẩm theo thời gian thực</p>
          <p className={`text-sm flex items-center ${connectionStatus === 'connected' ? 'text-green-500' : 'text-red-500'}`}>
            Trạng thái kết nối: {connectionStatus === 'connected' ? 'Đã kết nối' : 'Mất kết nối'}
            {connectionStatus === 'connected' && (
              <span className="relative flex h-3 w-3 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6 data-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Nồng độ khí</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {sensorData.gas.current.toFixed(1)} <span className="text-sm text-gray-500">ppm</span>
                </p>
                <p className="mt-1 text-sm text-green-500">
                  <i className="fas fa-check-circle mr-1"></i> Mức bình thường
                </p>
              </div>
              <div className="gauge-container">
                <div className="gauge-body">
                  <div className="gauge-fill bg-blue-500" style={{ transform: `rotate(${Math.min(sensorData.gas.current / 1000, 1) * 0.5}turn)` }}></div>
                </div>
                <div className="gauge-cover">{Math.min(Math.round(sensorData.gas.current / 10), 100)}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 data-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Nhiệt độ</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {sensorData.tempHumidity.current.temp.toFixed(1)} <span className="text-sm text-gray-500">°C</span>
                </p>
                <p className="mt-1 text-sm text-blue-500">
                  <i className="fas fa-thermometer-half mr-1"></i> Thoải mái
                </p>
              </div>
              <div>
                <i className="fas fa-temperature-high text-4xl text-orange-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 data-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Độ ẩm</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {sensorData.tempHumidity.current.humidity.toFixed(1)} <span className="text-sm text-gray-500">%</span>
                </p>
                <p className="mt-1 text-sm text-green-500">
                  <i className="fas fa-tint mr-1"></i> Tối ưu
                </p>
              </div>
              <div>
                <i className="fas fa-tint text-4xl text-blue-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gas Concentration Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Nồng độ khí</h2>
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-sm font-medium text-green-600">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Live
                </span>
              </div>
            </div>
            <div className="h-80">
              <canvas ref={gasChartRef}></canvas>
            </div>
          </div>

          {/* Temperature & Humidity Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Nhiệt độ & Độ ẩm</h2>
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-sm font-medium text-green-600">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Live
                </span>
              </div>
            </div>
            <div className="h-80">
              <canvas ref={tempHumidityChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Recent Readings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gas Readings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-800">Đọc khí gần đây</h2>
                <span className="flex items-center text-sm font-medium text-green-600 ml-2">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Live
                </span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">Xem tất cả</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thiết bị</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sensorData.gas.logs.slice(-5).reverse().map(log => (
                    <tr key={log.created}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(log.created)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.device_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.concentrations.toFixed(1)} ppm</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Bình thường</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Temperature/Humidity Readings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-800">Nhiệt độ/Độ ẩm gần đây</h2>
                <span className="flex items-center text-sm font-medium text-green-600 ml-2">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Live
                </span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">Xem tất cả</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thiết bị</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhiệt độ (°C)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Độ ẩm (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sensorData.tempHumidity.logs.slice(-5).reverse().map(log => (
                    <tr key={log.created}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(log.created)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.device_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.temperature.toFixed(1)} °C</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.humidity.toFixed(1)} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 