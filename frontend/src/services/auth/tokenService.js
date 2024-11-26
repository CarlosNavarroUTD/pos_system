import axios from '../api/config';

class TokenService {
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  saveTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  removeTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async refreshAccessToken() {
    try {
      const response = await axios.post('/api/token/refresh/', {
        refresh: this.getRefreshToken(),
      });
      this.saveTokens(response.data.access, response.data.refresh);
      return response.data.access;
    } catch (error) {
      this.removeTokens();
      throw error;
    }
  }
}

export default new TokenService();