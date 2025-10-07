/**
 * src/config/apiAxios.js
 */

import Axios from "axios";

const URL_API = process.env.REACT_APP_BASEURL || "http://148.163.73.195:33570";

const api = Axios.create({
  baseURL: URL_API,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

export default api;
