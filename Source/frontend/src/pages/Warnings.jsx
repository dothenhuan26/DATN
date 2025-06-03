import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faExclamationTriangle, faSpinner, faChevronLeft, faChevronRight, faPrint } from '@fortawesome/free-solid-svg-icons';
import { getWarningLogsV2 } from '../services/warningService';
import DashboardLayout from '../layouts/DashboardLayout';
import { formatDateForAPI, formatDateToVietnamese } from '../utils/dateUtils';

const typeOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'temperature', label: 'Nhiệt độ' },
  { value: 'gas_concentration', label: 'Khí gas' },
];
const orderOptions = [
  { value: 'asc', label: 'Tăng dần' },
  { value: 'desc', label: 'Giảm dần' },
];

const Warnings = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloading, setReloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [warningCursorHistory, setWarningCursorHistory] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    limit: 10,
    from: new Date().toISOString().split('T')[0] + ' 00:00:00',
    to: new Date().toISOString().split('T')[0] + ' 23:59:59',
    type: '',
    order: 'desc'
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentPage(1);
    setWarningCursorHistory([]);
    try {
      const response = await getWarningLogsV2({
        limit: filters.limit,
        from: formatDateForAPI(filters.from),
        to: formatDateForAPI(filters.to),
        order: filters.order,
        type: filters.type || undefined
      });
      if (response.success) {
        setWarnings(response.data.logs);
        setWarningCursorHistory([{ current: undefined, next: response.data.next_cursor }]);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      setError('Không thể áp dụng bộ lọc. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setReloading(true);
      try {
        // Lấy cursor hiện tại từ history của trang trước
        const cursor = warningCursorHistory[newPage - 1].current;
        const response = await getWarningLogsV2({
          cursor,
          limit: filters.limit,
          from: formatDateForAPI(filters.from),
          to: formatDateForAPI(filters.to),
          order: filters.order,
          type: filters.type || undefined
        });
        if (response.success) {
          setWarnings(response.data.logs);
          // Cập nhật history với cursor hiện tại và next_cursor
          const newHistory = warningCursorHistory.slice(0, newPage + 1);
          newHistory[newPage] = { current: cursor, next: response.data.next_cursor };
          setWarningCursorHistory(newHistory);
        }
      } catch (err) {
        console.error('Error changing page:', err);
      } finally {
        setReloading(false);
      }
    } else if (direction === 'next' && warningCursorHistory[warningCursorHistory.length - 1]?.next) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setReloading(true);
      try {
        const cursor = warningCursorHistory[warningCursorHistory.length - 1].next;
        const response = await getWarningLogsV2({
          cursor,
          limit: filters.limit,
          from: formatDateForAPI(filters.from),
          to: formatDateForAPI(filters.to),
          order: filters.order,
          type: filters.type || undefined
        });
        if (response.success) {
          setWarnings(response.data.logs);
          // Thêm cursor hiện tại và next_cursor vào history
          setWarningCursorHistory([...warningCursorHistory, { current: cursor, next: response.data.next_cursor }]);
        }
      } catch (err) {
        console.error('Error changing page:', err);
      } finally {
        setReloading(false);
      }
    }
  };

  const handleReload = async () => {
    setReloading(true);
    try {
      // Lấy cursor hiện tại từ history
      const cursor = warningCursorHistory[currentPage - 1].current;
      const response = await getWarningLogsV2({
        cursor,
        limit: filters.limit,
        from: formatDateForAPI(filters.from),
        to: formatDateForAPI(filters.to),
        order: filters.order,
        type: filters.type || undefined
      });
      if (response.success) {
        setWarnings(response.data.logs);
        // Cập nhật next_cursor trong history
        const newHistory = [...warningCursorHistory];
        newHistory[currentPage - 1] = { ...newHistory[currentPage - 1], next: response.data.next_cursor };
        setWarningCursorHistory(newHistory);
      }
    } catch (err) {
      console.error('Error reloading warnings:', err);
    } finally {
      setReloading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const response = await getWarningLogsV2({
          limit: filters.limit,
          from: formatDateForAPI(filters.from),
          to: formatDateForAPI(filters.to),
          order: filters.order,
          type: filters.type || undefined
        });
        if (response.success) {
          setWarnings(response.data.logs);
          setWarningCursorHistory([{ current: undefined, next: response.data.next_cursor }]);
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

  const getWarningIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <FontAwesomeIcon icon={faTemperatureHigh} className="text-red-500" />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />;
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    const date = new Date(dateTimeStr.replace(' ', 'T'));
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleExportCSV = () => {
    if (!warnings || warnings.length === 0) {
      alert('Không có dữ liệu để xuất.');
      return;
    }

    const headers = ['Loại cảnh báo', 'Giá trị', 'Đơn vị', 'Thời gian', 'Thiết bị'];
    const csvRows = [
      headers.join(','), // header row
      ...warnings.map(log => {
        const typeDisplay = log.type === 'temperature' ? 'Nhiệt độ' : 'Khí gas';
        const deviceDisplay = `Thiết bị #${log.device_id}`;
        // Ensure values with commas are enclosed in quotes
        return [
          `"${typeDisplay}"`, 
          log.value, 
          `"${log.unit}"`,
          `"${formatDateToVietnamese(log.created)}"`,
          `"${deviceDisplay}"`
        ].join(',');
      })
    ];

    // Add BOM for UTF-8 CSV compatibility with Excel
    const bom = '\ufeff';
    const csvString = bom + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'canh_bao_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const warningsContent = (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh sách cảnh báo</h1>
          <p className="text-gray-600">Theo dõi các cảnh báo về nhiệt độ và khí gas</p>
        </div>
        <form className="flex flex-wrap gap-2 items-end" onSubmit={handleApplyFilters}>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Loại cảnh báo</label>
            <select value={filters.type} onChange={handleFilterChange} name="type" className="border rounded px-2 py-1">
              {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sắp xếp</label>
            <select value={filters.order} onChange={handleFilterChange} name="order" className="border rounded px-2 py-1">
              {orderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
            <input type="datetime-local" value={filters.from} onChange={handleFilterChange} name="from" className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
            <input type="datetime-local" value={filters.to} onChange={handleFilterChange} name="to" className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Số lượng</label>
            <input type="number" min={1} max={100} value={filters.limit} onChange={handleFilterChange} name="limit" className="border rounded px-2 py-1 w-20" />
          </div>
          <button type="submit" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Lọc</button>
          <button 
            type="button" 
            onClick={handleExportCSV}
            className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            <FontAwesomeIcon icon={faPrint} className="mr-2" /> Xuất báo cáo
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại cảnh báo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thiết bị
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(warnings || []).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getWarningIcon(log.type)}
                      <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                        {log.type === 'temperature' ? 'Nhiệt độ' : 'Khí gas'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {log.value} {log.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateTime(log.created)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Thiết bị #{log.device_id}
                    </div>
                  </td>
                </tr>
              ))}
              {(!warnings || warnings.length === 0) && !loading && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center px-6 py-3 bg-gray-50">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Trước
          </button>
          <button
            onClick={() => handlePageChange('next')}
            disabled={!warningCursorHistory.length || !warningCursorHistory[warningCursorHistory.length - 1]?.next}
            className={`flex items-center px-3 py-1 rounded ${!warningCursorHistory.length || !warningCursorHistory[warningCursorHistory.length - 1]?.next ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Sau <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {warningsContent}
    </DashboardLayout>
  );
};

export default Warnings; 