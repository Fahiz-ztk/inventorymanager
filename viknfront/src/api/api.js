import axios from 'axios';

const productApi = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getToken = async (username, password) => {
  const response = await productApi.post('/token/', {
    username,
    password,
  });
  const token = response.data.token;
  productApi.defaults.headers.common['Authorization'] = `Token ${token}`;
  return token;
};

export const logout = () => {
  delete productApi.defaults.headers.common['Authorization'];

};

export default productApi;
