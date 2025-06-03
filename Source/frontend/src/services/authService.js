const API_URL = 'http://localhost:8088/api/v1';

export const authService = {
  // Lưu token vào localStorage
  setTokens(data, rememberMe = false) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('token_expires_at', data.session_expire_at);
  },

  // Xóa token khỏi storage
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('token_expires_at');
  },

  // Kiểm tra token có hợp lệ không
  isTokenValid() {
    const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    const tokenExpiresAt = localStorage.getItem('token_expires_at') || sessionStorage.getItem('token_expires_at');
    return accessToken && tokenExpiresAt && new Date().getTime() < parseInt(tokenExpiresAt);
  },

  // Lấy access token
  getAccessToken() {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  },

  // Lấy refresh token
  getRefreshToken() {
    return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  },

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Không có refresh token');
      }

      const response = await fetch(`${API_URL}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Kiểm tra xem token hiện tại đang được lưu ở đâu
        const isRemembered = localStorage.getItem('access_token') !== null;
        this.setTokens(data.data, isRemembered);
        return data.data.access_token;
      } else {
        throw new Error(data.message || 'Không thể làm mới token');
      }
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  },

  // Đăng nhập
  async login(username, password, rememberMe = false) {
    try {
      const response = await fetch(`${API_URL}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();
      
      if (response.status === 401) {
        throw new Error('Thông tin đăng nhập không chính xác! Hãy thử lại.');
      }
      
      if (data.success) {
        this.setTokens(data.data, rememberMe);
        return data.data;
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      throw error;
    }
  }
}; 