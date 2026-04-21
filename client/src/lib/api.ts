import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
console.log("API URL:", API_BASE);

if (!API_BASE) {
  console.error("❌ VITE_API_URL is not set!");
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});
