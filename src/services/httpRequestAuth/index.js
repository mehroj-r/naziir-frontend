import axios from 'axios';

const httpRequestAuth = axios.create({
    baseURL: "http://dilnur.lumipass.uz/api/auth",
    timeout: 100000,
  });

export default httpRequestAuth;
