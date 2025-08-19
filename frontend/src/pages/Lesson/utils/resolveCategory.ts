// -------------------------------------------------------------------------
// ยูทิลจัดหมวดให้เป็น {group, sub, path} และฟังก์ชันนับจำนวน path (ใช้โชว์ตัวเลขในเมนู)
// --------------------------------------------------------------------------
import { CATEGORY_GROUP } from "../Category";
export type CategoryPath = {group: string;sub: string | null;path: string};
export function resolveCategoryPath(raw?: string): CategoryPath {
    const value = (raw ?? "").trim();

    if (!value) return { group: "Others", sub: null, path: "Others"};

    // รองรับรูปแบบ "Group > Sub" ถ้า data เดิมเคยส่งมาแบบนี้
    if (value.includes(">")) {
        const [g,s] = value.split(">").map((v) => v.trim());
        const group = CATEGORY_GROUP[g] ? g : "Others"
        const sub = s || null;
        return {group,sub,path: sub ? `${group}/${sub}` : group}
    }
      // จับคู่เป็นหมวดย่อยที่อยู่ในกลุ่มใด
    for (const [group,subs] of Object.entries(CATEGORY_GROUP)) {
        if (subs.includes(value)) return {group,sub: value, path: `${group}/${value}`}
    }
  
    // ถ้าตรงชื่อหมวดหลักพอดี
    if (CATEGORY_GROUP[value])  return { group: value, sub: null, path: `${value}` }

    return { group: "Others", sub: null, path: "Others"}
}

// -------------------------------------------------------------------------
//                    ฟังก์ชันนับจำนวน path (ใช้โชว์ตัวเลขในเมนู)
// --------------------------------------------------------------------------

export function countByPath(paths: string[]): Record<string, number> {
  return paths.reduce((acc, p) => {
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
