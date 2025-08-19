// src/Authentication/AuthContext.tsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from "react";
import { http } from "./http"; // ใช้ axios instance ที่มี withCredentials + interceptor

// === Shape ของ User (ตามเดิม) ===
export interface User {
  upn?: string;
  name?: string;
  email?: string;
  groups?: string[];
  role?: string;
  exp?: number;
  [key: string]: unknown;
}

// === Context API แบบ cookie-session ===
// - token: คงไว้ให้เข้ากันได้กับโค้ดเก่า (จะเป็น null เสมอ)
// - loading: รอเช็ค/รีเฟรช session
// - login(email,password)/logout()/refresh(): ฟังก์ชันพร้อมใช้ทั่วแอป
export interface AuthContextType {
  token: null;                     // deprecated: ไม่ใช้แล้ว (คงไว้กันพัง)
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ดึงโปรไฟล์ (และรีเฟรชถ้าจำเป็น) ตอนบูตแอป
  const bootstrap = async () => {
    try {
      const me = await http.get<User>("/profile");
      setUser(me.data ?? null);
    } catch {
      // ถ้า access หมดอายุ → interceptor จะลองรีเฟรชอยู่แล้ว
      // กันพลาด: ลองเรียก refresh เองอีกชั้นหนึ่ง แล้วดึงโปรไฟล์ใหม่
      try {
        await http.post("/login/refresh");
        const me2 = await http.get<User>("/profile");
        setUser(me2.data ?? null);
      } catch {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  // ช่วยรักษา session เวลา user กลับมาโฟกัส/สลับแท็บ
  useEffect(() => {
    const ensureSession = async () => {
      try {
        await http.get("/profile");            // ok → มี session
      } catch {
        try {
          await http.post("/login/refresh");   // หมดอายุ → รีเฟรช
          const me = await http.get<User>("/profile");
          setUser(me.data ?? null);
        } catch {
          setUser(null);                       // รีเฟรชไม่ผ่าน → ถือว่า logout
        }
      }
    };
    const onFocus = () => { ensureSession(); };
    const onVisible = () => { if (document.visibilityState === "visible") ensureSession(); };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // === API ให้เพจอื่นเรียกใช้ ===
  const login = async (email: string, password: string) => {
    await http.post("/login", { email, password }); // เซ็ตคุกกี้ jwt/refresh ฝั่งเซิร์ฟเวอร์
    const me = await http.get<User>("/profile");
    setUser(me.data ?? null);
  };

  const refresh = async () => {
    await http.post("/login/refresh");
    const me = await http.get<User>("/profile");
    setUser(me.data ?? null);
  };

  const logout = async () => {
    // ถ้ามี endpoint /login/logout ให้เรียกเคลียร์คุกกี้ฝั่งเซิร์ฟเวอร์
    try { await http.post("/login/logout"); } catch { /* ignore */ }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token: null,   // deprecated
        user,
        loading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
