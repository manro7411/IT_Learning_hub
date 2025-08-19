// src/routes/RequireAuth.tsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { http } from "../Authentication/http";

export default function RequireAuth() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // ถ้ามี jwt ใช้ได้ → ผ่าน
        // ถ้า jwt หมดอายุ → interceptor จะเรียก /login/refresh ให้อัตโนมัติ
        // ถ้า refresh สำเร็จ → ผ่าน
        // ถ้า refresh ล้มเหลว → onUnauthenticated() ใน http.ts จะ redirect ไปหน้า login ให้เอง
        await http.get("/profile");
      } catch {
        // ไม่ต้องทำอะไรเพิ่ม ปล่อยให้ http.ts พาไป "/" แล้ว
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (checking) return <div className="p-6">Checking session…</div>;

  return <Outlet />;
}
