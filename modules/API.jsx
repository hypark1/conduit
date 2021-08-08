import React from 'react';
import axios from 'axios';

/*api통신*/
const API = () => {
  const defaultOptions = {
    baseURL: 'https://conduit.productionready.io/api',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json'
    },
    responseType: 'json',
    responseEncoding: 'utf8'
  };

  let api = axios.create(defaultOptions);

  api.interceptors.request.use(async (config) => {
    let token = await localStorage.getItem('hyparkToken');
    if (token) {
      config.headers['Authorization'] = 'Token ' + token;
    }
    return config;
  });

  return api;
};

export default API();
