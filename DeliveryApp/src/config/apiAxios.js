/**
 * src/config/apiAxios.js
 */

import Axios from "axios";

const URL_API = process.env.REACT_APP_BASEURL || "http://srv.deliverybairro.com";

const api = Axios.create({
  baseURL: URL_API,
  headers: {
    'Content-Type':'application/json',
    'Accept': '*/*'
  }
});

export default api;
