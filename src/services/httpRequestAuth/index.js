import axios from 'axios';

const httpRequestAuth = axios.create({
    baseURL: "https://project2.newuu.uz/api/auth",
    timeout: 100000,
  });

export default httpRequestAuth;
