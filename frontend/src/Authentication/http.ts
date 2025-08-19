// src/Authentication/http.ts
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

export const http: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// ให้ถือว่าเป็น endpoint auth
const isAuthEndpoint = (url?: string) => url?.includes("/login") || url?.includes("/refresh");

// shared promise กัน refresh ซ้อน
let refreshPromise: Promise<void> | null = null;

// ✅ อย่าพาไป /login ทันที รอเช็ค /profile อีกรอบก่อน
let onUnauthenticated: (() => void) | null = null;
export const setOnUnauthenticated = (fn: () => void) => { onUnauthenticated = fn; };

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status ?? 0;

    // ✅ รองรับทั้ง 401/403
    if (!original || isAuthEndpoint(original.url) || ![401, 403].includes(status)) {
      return Promise.reject(error);
    }
    if (original._retry) return Promise.reject(error);
    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios.post("/api/login/refresh", null, { withCredentials: true })
          .then(() => {})
          .finally(() => { refreshPromise = null; });
      }
      await refreshPromise;

      // retry คำขอเดิมหลัง refresh สำเร็จ
      return http(original);
    } catch (e) {
      // ❗อย่า redirect เลยทันที ลองเช็ค /profile อีกครั้งก่อน
      try {
        await axios.get("/api/profile", { withCredentials: true });
        // ถ้าเข้ามาถึงนี่ แปลว่าโปรไฟล์เข้าได้แล้ว ก็ไม่ต้องเด้ง
        return http(original);
      } catch {
        if (onUnauthenticated) onUnauthenticated(); // ค่อยเด้งตอนนี้
        return Promise.reject(e);
      }
    }
  }
);

export default http;