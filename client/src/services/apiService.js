/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/22/17.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Override default axios behavior to always pass data instead of full response object
api.interceptors.response.use(response => response.data, error => Promise.reject(error.response));

export default api;
