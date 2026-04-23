import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
console.log("🌐 Frontend API Base URL:", API_BASE);
console.log(
  "🔧 Environment check - VITE_API_URL:",
  import.meta.env.VITE_API_URL
);

if (!API_BASE) {
  console.error("❌ VITE_API_URL is not set! Authentication will fail.");
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
