import axios from "axios";

const api = axios.create({
  baseURL: "https://srv.deliverybairro.com", 
  // baseURL: 'http://192.168.0.9:3333', //(ambiente de teste local)
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Accept": "*/*"
  }
})

export default api;
