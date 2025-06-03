import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getGasSensorLogs, getTemperatureSensorLogs } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faFilter } from '@fortawesome/free-solid-svg-icons';
import { formatDateForAPI, formatDateToVietnamese } from '../utils/dateUtils';

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Calculate data distribution
const calculateDistribution = (logs) => {
  if (!logs.length) return [0, 0, 0, 0, 0];
  
  const values = logs.map(log => log.concentrations);
  const ranges = [0, 0, 0, 0, 0];
  
  // Định nghĩa các khoảng giá trị
  const thresholds = [0, 200, 400, 600, 800, 1000];
  
  values.forEach(value => {
    for (let i = 0; i < thresholds.length - 1; i++) {
      if (value >= thresholds[i] && value < thresholds[i + 1]) {
        ranges[i]++;
        break;
      }
    }
  });

  return ranges;
};

// Calculate temperature distribution
const calculateTemperatureDistribution = (logs) => {
  if (!logs.length) return [0, 0, 0, 0, 0];
  
  const values = logs.map(log => log.temperature);
  const ranges = [0, 0, 0, 0, 0];
  
  // Định nghĩa các khoảng giá trị nhiệt độ
  const thresholds = [0, 20, 25, 30, 35, 100];
  
  values.forEach(value => {
    for (let i = 0; i < thresholds.length - 1; i++) {
      if (value >= thresholds[i] && value < thresholds[i + 1]) {
        ranges[i]++;
        break;
      }
    }
  });

  return ranges;
};

// Calculate humidity distribution
const calculateHumidityDistribution = (logs) => {
  if (!logs.length) return [0, 0, 0, 0, 0];
  
  const values = logs.map(log => log.humidity);
  const ranges = [0, 0, 0, 0, 0];
  
  // Định nghĩa các khoảng giá trị độ ẩm
  const thresholds = [0, 20, 40, 60, 80, 100];
  
  values.forEach(value => {
    for (let i = 0; i < thresholds.length - 1; i++) {
      if (value >= thresholds[i] && value < thresholds[i + 1]) {
        ranges[i]++;
        break;
      }
    }
  });

  return ranges;
};

const Analytics = () => {
  const [gasData, setGasData] = useState({
    logs: [],
    stats: {
      min: 0,
      max: 0,
      avg: 0,
      total: 0
    }
  });
  const [tempData, setTempData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadingTimeChart, setReloadingTimeChart] = useState(false);
  const [reloadingDistribution, setReloadingDistribution] = useState(false);
  const [reloadingTable, setReloadingTable] = useState(false);
  const [reloadingTempTable, setReloadingTempTable] = useState(false);

  // Thêm state để lưu cursor history, mỗi phần tử là một object chứa current và next cursor
  const [gasCursorHistory, setGasCursorHistory] = useState([]);
  const [tempCursorHistory, setTempCursorHistory] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    limit: 50,
    from: new Date().toISOString().split('T')[0] + ' 00:00:00',
    to: new Date().toISOString().split('T')[0] + ' 23:59:59'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [currentTempPage, setCurrentTempPage] = useState(1);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    setCurrentPage(1);
    setCurrentTempPage(1);
    setGasCursorHistory([]);
    setTempCursorHistory([]);
    try {
      // Fetch gas data - khi apply filter không truyền cursor
      const gasResponse = await getGasSensorLogs(filters.limit, undefined, formatDateForAPI(filters.from), formatDateForAPI(filters.to));
      if (gasResponse.success) {
        const logs = gasResponse.data.logs;
        const values = logs.map(log => log.concentrations);
        setGasData({
          logs,
          stats: {
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            total: values.reduce((a, b) => a + b, 0)
          }
        });
        // Lưu cursor hiện tại là undefined và next_cursor
        setGasCursorHistory([{ current: undefined, next: gasResponse.data.next_cursor }]);
      }

      // Fetch temperature data - khi apply filter không truyền cursor
      const tempResponse = await getTemperatureSensorLogs(filters.limit, undefined, formatDateForAPI(filters.from), formatDateForAPI(filters.to));
      if (tempResponse.success) {
        setTempData(tempResponse.data.logs);
        // Lưu cursor hiện tại là undefined và next_cursor
        setTempCursorHistory([{ current: undefined, next: tempResponse.data.next_cursor }]);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      setError('Không thể áp dụng bộ lọc. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleTempPageChange = async (direction) => {
    if (direction === 'prev' && currentTempPage > 1) {
      const newPage = currentTempPage - 1;
      setCurrentTempPage(newPage);
      setReloadingTempTable(true);
      try {
        // Lấy cursor hiện tại từ history của trang trước
        const cursor = tempCursorHistory[newPage - 1].current;
        const response = await getTemperatureSensorLogs(filters.limit, cursor, filters.from, filters.to);
        if (response.success) {
          setTempData(response.data.logs);
          // Cập nhật history với cursor hiện tại và next_cursor
          const newHistory = tempCursorHistory.slice(0, newPage + 1);
          newHistory[newPage] = { current: cursor, next: response.data.next_cursor };
          setTempCursorHistory(newHistory);
        }
      } catch (err) {
        console.error('Error changing temperature page:', err);
      } finally {
        setReloadingTempTable(false);
      }
    } else if (direction === 'next' && tempCursorHistory[tempCursorHistory.length - 1].next) {
      const newPage = currentTempPage + 1;
      setCurrentTempPage(newPage);
      setReloadingTempTable(true);
      try {
        const cursor = tempCursorHistory[tempCursorHistory.length - 1].next;
        const response = await getTemperatureSensorLogs(filters.limit, cursor, filters.from, filters.to);
        if (response.success) {
          setTempData(response.data.logs);
          // Thêm cursor hiện tại và next_cursor vào history
          setTempCursorHistory([...tempCursorHistory, { current: cursor, next: response.data.next_cursor }]);
        }
      } catch (err) {
        console.error('Error changing temperature page:', err);
      } finally {
        setReloadingTempTable(false);
      }
    }
  };

  const handlePageChange = async (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setReloadingTimeChart(true);
      try {
        // Lấy cursor hiện tại từ history của trang trước
        const cursor = gasCursorHistory[newPage - 1].current;
        const response = await getGasSensorLogs(filters.limit, cursor, filters.from, filters.to);
        if (response.success) {
          const logs = response.data.logs;
          const values = logs.map(log => log.concentrations);
          setGasData({
            logs,
            stats: {
              min: Math.min(...values),
              max: Math.max(...values),
              avg: values.reduce((a, b) => a + b, 0) / values.length,
              total: values.reduce((a, b) => a + b, 0)
            }
          });
          // Cập nhật history với cursor hiện tại và next_cursor
          const newHistory = gasCursorHistory.slice(0, newPage + 1);
          newHistory[newPage] = { current: cursor, next: response.data.next_cursor };
          setGasCursorHistory(newHistory);
        }
      } catch (err) {
        console.error('Error changing page:', err);
      } finally {
        setReloadingTimeChart(false);
      }
    } else if (direction === 'next' && gasCursorHistory[gasCursorHistory.length - 1].next) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setReloadingTimeChart(true);
      try {
        const cursor = gasCursorHistory[gasCursorHistory.length - 1].next;
        const response = await getGasSensorLogs(filters.limit, cursor, filters.from, filters.to);
        if (response.success) {
          const logs = response.data.logs;
          const values = logs.map(log => log.concentrations);
          setGasData({
            logs,
            stats: {
              min: Math.min(...values),
              max: Math.max(...values),
              avg: values.reduce((a, b) => a + b, 0) / values.length,
              total: values.reduce((a, b) => a + b, 0)
            }
          });
          // Thêm cursor hiện tại và next_cursor vào history
          setGasCursorHistory([...gasCursorHistory, { current: cursor, next: response.data.next_cursor }]);
        }
      } catch (err) {
        console.error('Error changing page:', err);
      } finally {
        setReloadingTimeChart(false);
      }
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Fetch gas data - lần đầu không truyền cursor
        const gasResponse = await getGasSensorLogs(filters.limit, undefined, formatDateForAPI(filters.from), formatDateForAPI(filters.to));
        if (gasResponse.success) {
          const logs = gasResponse.data.logs;
          const values = logs.map(log => log.concentrations);
          setGasData({
            logs,
            stats: {
              min: Math.min(...values),
              max: Math.max(...values),
              avg: values.reduce((a, b) => a + b, 0) / values.length,
              total: values.reduce((a, b) => a + b, 0)
            }
          });
          // Lưu cursor hiện tại là undefined và next_cursor
          setGasCursorHistory([{ current: undefined, next: gasResponse.data.next_cursor }]);
        }

        // Fetch temperature data - lần đầu không truyền cursor
        const tempResponse = await getTemperatureSensorLogs(filters.limit, undefined, formatDateForAPI(filters.from), formatDateForAPI(filters.to));
        if (tempResponse.success) {
          setTempData(tempResponse.data.logs);
          // Lưu cursor hiện tại là undefined và next_cursor
          setTempCursorHistory([{ current: undefined, next: tempResponse.data.next_cursor }]);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const fetchTempData = async () => {
    try {
      const response = await getTemperatureSensorLogs(50);
      if (response.success) {
        setTempData(response.data.logs);
      }
    } catch (error) {
      console.error('Error fetching temperature data:', error);
      setError('Không thể tải dữ liệu nhiệt độ và độ ẩm');
    }
  };

  const handleReloadTimeChart = async () => {
    setReloadingTimeChart(true);
    try {
      // Lấy cursor hiện tại từ history
      const cursor = gasCursorHistory[currentPage - 1].current;
      const response = await getGasSensorLogs(filters.limit, cursor, filters.from, filters.to);
      if (response.success) {
        const logs = response.data.logs;
        setGasData(prev => ({
          ...prev,
          logs: logs
        }));
        // Cập nhật next_cursor trong history
        const newHistory = [...gasCursorHistory];
        newHistory[currentPage - 1] = { ...newHistory[currentPage - 1], next: response.data.next_cursor };
        setGasCursorHistory(newHistory);
      }
    } catch (err) {
      console.error('Error reloading time chart:', err);
    } finally {
      setReloadingTimeChart(false);
    }
  };

  const handleReloadDistribution = async () => {
    setReloadingDistribution(true);
    try {
      // Lấy cursor hiện tại từ history
      const cursor = gasCursorHistory[currentPage - 1].current;
      const response = await getGasSensorLogs(filters.limit, cursor, filters.from, filters.to);
      if (response.success) {
        const logs = response.data.logs;
        setGasData(prev => ({
          ...prev,
          logs: logs
        }));
        // Cập nhật next_cursor trong history
        const newHistory = [...gasCursorHistory];
        newHistory[currentPage - 1] = { ...newHistory[currentPage - 1], next: response.data.next_cursor };
        setGasCursorHistory(newHistory);
      }
    } catch (err) {
      console.error('Error reloading distribution:', err);
    } finally {
      setReloadingDistribution(false);
    }
  };

  const handleReloadTable = async () => {
    setReloadingTable(true);
    try {
      // Lấy cursor hiện tại từ history
      const cursor = gasCursorHistory[currentPage - 1].current;
      const response = await getGasSensorLogs(filters.limit, cursor, filters.from, filters.to);
      if (response.success) {
        const logs = response.data.logs;
        setGasData(prev => ({
          ...prev,
          logs: logs
        }));
        // Cập nhật next_cursor trong history
        const newHistory = [...gasCursorHistory];
        newHistory[currentPage - 1] = { ...newHistory[currentPage - 1], next: response.data.next_cursor };
        setGasCursorHistory(newHistory);
      }
    } catch (err) {
      console.error('Error reloading table:', err);
    } finally {
      setReloadingTable(false);
    }
  };

  const handleReloadTempTable = async () => {
    setReloadingTempTable(true);
    try {
      // Lấy cursor hiện tại từ history
      const cursor = tempCursorHistory[currentTempPage - 1].current;
      const response = await getTemperatureSensorLogs(filters.limit, cursor, filters.from, filters.to);
      if (response.success) {
        setTempData(response.data.logs);
        // Cập nhật next_cursor trong history
        const newHistory = [...tempCursorHistory];
        newHistory[currentTempPage - 1] = { ...newHistory[currentTempPage - 1], next: response.data.next_cursor };
        setTempCursorHistory(newHistory);
      }
    } catch (error) {
      console.error('Error reloading temperature data:', error);
    } finally {
      setReloadingTempTable(false);
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
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
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 1000,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Prepare chart data
  const timeChartData = {
    labels: gasData.logs.map(log => {
      const date = new Date(log.created);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }),
    datasets: [
      {
        label: 'Nồng độ khí (ppm)',
        data: gasData.logs.map(log => log.concentrations),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6
      }
    ]
  };

  // Distribution chart data
  const distributionData = {
    labels: ['0-200', '200-400', '400-600', '600-800', '800-1000'],
    datasets: [
      {
        label: 'Phân bố dữ liệu',
        data: calculateDistribution(gasData.logs),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(139, 92, 246, 0.5)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Temperature & Humidity Distribution Chart
  const tempHumidityDistributionData = {
    labels: ['Nhiệt độ', 'Độ ẩm'],
    datasets: [
      {
        label: '0-20°C / 0-20%',
        data: [
          calculateTemperatureDistribution(tempData)[0],
          calculateHumidityDistribution(tempData)[0]
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: '20-25°C / 20-40%',
        data: [
          calculateTemperatureDistribution(tempData)[1],
          calculateHumidityDistribution(tempData)[1]
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      },
      {
        label: '25-30°C / 40-60%',
        data: [
          calculateTemperatureDistribution(tempData)[2],
          calculateHumidityDistribution(tempData)[2]
        ],
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1
      },
      {
        label: '30-35°C / 60-80%',
        data: [
          calculateTemperatureDistribution(tempData)[3],
          calculateHumidityDistribution(tempData)[3]
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      },
      {
        label: '35-100°C / 80-100%',
        data: [
          calculateTemperatureDistribution(tempData)[4],
          calculateHumidityDistribution(tempData)[4]
        ],
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1
      }
    ]
  };

  // Temperature & Humidity Time Series Chart
  const tempHumidityTimeChartData = {
    labels: tempData.map(log => formatDateToVietnamese(log.created)),
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: tempData.map(log => log.temperature),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6
      },
      {
        label: 'Độ ẩm (%)',
        data: tempData.map(log => log.humidity),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6
      }
    ]
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Phân tích dữ liệu</h1>
          <p className="text-gray-600">Thống kê và phân tích dữ liệu môi trường</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800">Bộ lọc dữ liệu</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
              <input
                type="number"
                name="limit"
                value={filters.limit}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
              <input
                type="datetime-local"
                name="from"
                value={filters.from.replace(' ', 'T')}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
              <input
                type="datetime-local"
                name="to"
                value={filters.to.replace(' ', 'T')}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Gas Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nồng độ khí</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Trung bình: <span className="font-medium">{gasData.stats.avg.toFixed(1)} ppm</span>
              </p>
              <p className="text-sm text-gray-600">
                Thấp nhất: <span className="font-medium">{gasData.stats.min.toFixed(1)} ppm</span>
              </p>
              <p className="text-sm text-gray-600">
                Cao nhất: <span className="font-medium">{gasData.stats.max.toFixed(1)} ppm</span>
              </p>
            </div>
          </div>

          {/* Temperature Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nhiệt độ</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Trung bình: <span className="font-medium">
                  {(tempData.reduce((acc, curr) => acc + curr.temperature, 0) / tempData.length || 0).toFixed(1)} °C
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Thấp nhất: <span className="font-medium">
                  {Math.min(...tempData.map(t => t.temperature) || [0]).toFixed(1)} °C
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Cao nhất: <span className="font-medium">
                  {Math.max(...tempData.map(t => t.temperature) || [0]).toFixed(1)} °C
                </span>
              </p>
            </div>
          </div>

          {/* Humidity Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Độ ẩm</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Trung bình: <span className="font-medium">
                  {(tempData.reduce((acc, curr) => acc + curr.humidity, 0) / tempData.length || 0).toFixed(1)} %
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Thấp nhất: <span className="font-medium">
                  {Math.min(...tempData.map(t => t.humidity) || [0]).toFixed(1)} %
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Cao nhất: <span className="font-medium">
                  {Math.max(...tempData.map(t => t.humidity) || [0]).toFixed(1)} %
                </span>
              </p>
            </div>
          </div>

          {/* Status Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Số lượng dữ liệu khí: <span className="font-medium">{gasData.logs.length}</span>
              </p>
              <p className="text-sm text-gray-600">
                Số lượng dữ liệu nhiệt độ: <span className="font-medium">{tempData.length}</span>
              </p>
              <p className="text-sm text-gray-600">
                Cập nhật lần cuối: <span className="font-medium">
                  {new Date().toLocaleString('vi-VN')}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gas Time Series Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Biểu đồ nồng độ khí theo thời gian</h3>
              <button
                onClick={handleReloadTimeChart}
                disabled={reloadingTimeChart}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                title="Làm mới dữ liệu"
              >
                <FontAwesomeIcon 
                  icon={faSync} 
                  className={`text-lg ${reloadingTimeChart ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
            <div className="h-80">
              <Line options={chartOptions} data={timeChartData} />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1 || reloadingTimeChart}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang trước
              </button>
              <span className="text-gray-600">Trang {currentPage}</span>
              <button
                onClick={() => handlePageChange('next')}
                disabled={reloadingTimeChart}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang sau
              </button>
            </div>
          </div>

          {/* Temperature & Humidity Time Series Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Biểu đồ nhiệt độ & độ ẩm theo thời gian</h3>
              <button
                onClick={handleReloadTempTable}
                disabled={reloadingTempTable}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                title="Làm mới dữ liệu"
              >
                <FontAwesomeIcon 
                  icon={faSync} 
                  className={`text-lg ${reloadingTempTable ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
            <div className="h-80">
              <Line 
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      min: 0,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Nhiệt độ (°C)'
                      }
                    },
                    y1: {
                      position: 'right',
                      min: 0,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Độ ẩm (%)'
                      },
                      grid: {
                        drawOnChartArea: false
                      }
                    }
                  }
                }} 
                data={tempHumidityTimeChartData} 
              />
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handleTempPageChange('prev')}
                disabled={currentTempPage === 1 || reloadingTempTable}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang trước
              </button>
              <span className="text-gray-600">Trang {currentTempPage}</span>
              <button
                onClick={() => handleTempPageChange('next')}
                disabled={reloadingTempTable}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gas Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Phân bố nồng độ khí</h3>
              <button
                onClick={handleReloadDistribution}
                disabled={reloadingDistribution}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                title="Làm mới dữ liệu"
              >
                <FontAwesomeIcon 
                  icon={faSync} 
                  className={`text-lg ${reloadingDistribution ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
            <div className="h-80">
              <Bar options={chartOptions} data={distributionData} />
            </div>
          </div>

          {/* Temperature & Humidity Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Phân bố nhiệt độ & độ ẩm</h3>
              <button
                onClick={handleReloadTempTable}
                disabled={reloadingTempTable}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                title="Làm mới dữ liệu"
              >
                <FontAwesomeIcon 
                  icon={faSync} 
                  className={`text-lg ${reloadingTempTable ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
            <div className="h-80">
              <Bar 
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      title: {
                        display: true,
                        text: 'Số lượng'
                      }
                    }
                  }
                }} 
                data={tempHumidityDistributionData} 
              />
            </div>
          </div>
        </div>

        {/* Recent Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gas Data Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Dữ liệu khí gần đây</h3>
              <button
                onClick={handleReloadTable}
                disabled={reloadingTable}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                title="Làm mới dữ liệu"
              >
                <FontAwesomeIcon 
                  icon={faSync} 
                  className={`text-lg ${reloadingTable ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="max-h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nồng độ (ppm)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gasData.logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.created).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.concentrations.toFixed(1)} ppm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            log.concentrations > 300 ? 'bg-red-100 text-red-800' : 
                            log.concentrations > 200 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {log.concentrations > 300 ? 'Cao' : 
                             log.concentrations > 200 ? 'Trung bình' : 
                             'Bình thường'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Temperature & Humidity Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Dữ liệu nhiệt độ & độ ẩm gần đây</h3>
              <button
                onClick={handleReloadTempTable}
                disabled={reloadingTempTable}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                title="Làm mới dữ liệu"
              >
                <FontAwesomeIcon 
                  icon={faSync} 
                  className={`text-lg ${reloadingTempTable ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="max-h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhiệt độ (°C)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Độ ẩm (%)</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tempData.map((log) => {
                      const tempStatus = log.temperature > 30 ? 'Cao' : log.temperature < 20 ? 'Thấp' : 'Bình thường';
                      const humidityStatus = log.humidity > 80 ? 'Cao' : log.humidity < 40 ? 'Thấp' : 'Bình thường';
                      
                      return (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(log.created).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.temperature.toFixed(1)} °C
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.humidity.toFixed(1)} %
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                tempStatus === 'Bình thường' ? 'bg-green-100 text-green-800' :
                                tempStatus === 'Cao' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                Nhiệt độ: {tempStatus}
                              </span>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                humidityStatus === 'Bình thường' ? 'bg-green-100 text-green-800' :
                                humidityStatus === 'Cao' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                Độ ẩm: {humidityStatus}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;