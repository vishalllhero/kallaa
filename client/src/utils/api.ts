const API_BASE = "https://your-backend-url.com"; // Replace with actual backend URL

export const safeFetch = async (url: string) => {
  try {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;
    const res = await fetch(fullUrl);
    const text = await res.text();

    try {
      const json = JSON.parse(text);
      return Array.isArray(json) ? json : json?.data || [];
    } catch {
      console.error("Non-JSON response:", text);
      return [];
    }
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
};
