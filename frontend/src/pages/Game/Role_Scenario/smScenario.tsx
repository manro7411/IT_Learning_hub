import type { ScenarioItem } from '../types/Scenario';

const poScenario: ScenarioItem[] = [
  {
    title: 'Assertive PO Behavior in Sprint Planning',
    background: 'ระหว่าง Sprint Planning ทีม Dev รู้สึกว่าฟีเจอร์ที่ใส่เข้ามามีมากเกินไป แต่ไม่มีใครกล้าแย้ง PO ซึ่งมักพูดเร็ว พูดจาชัดเจน และตัดสินใจรวดเร็ว',
    challenge: 'ทีมเริ่มเก็บเงียบ และ Sprint plan ที่ออกมาไม่สะท้อนความจริงของทีม',
  },
  {
    title: 'PO-Defined Solutions in the Product Backlog',
    background: 'PO ชอบกำหนดแนวทาง technical ใน user story เช่น “ให้ใช้ Firebase” หรือ “เขียนด้วย TypeScript',
    challenge: 'ทีมรู้สึกไม่เป็นเจ้าของ solution',
  },
  {
    title: 'Extended Duration of Daily Standups',
    background: 'ทีมใช้เวลาประมาณ 30 นาทีใน daily และมักหลุดไปเรื่อง technical detail',
    challenge: 'จะลดเวลาโดยไม่ให้ทีมรู้สึกว่าโดนควบคุมเกินไป',
  },
  {
    title: 'PO Control Over Sprint Planning',
    background: 'PO พูดเร็วและมักตัดสินใจเองใน Sprint Planning ทีมรู้สึกว่าไม่มีพื้นที่เสนอความคิดเห็น',
    challenge: 'คุณสังเกตว่าทีมเริ่มเงียบ และ estimation ดู optimistic เกินจริง',
  },
  {
    title: 'Challenges in Daily Standup Meetings',
    background: 'PO ใช้ daily standup ถามรายงานรายบุคคล และมอบหมายงาน ทำให้ Dev ไม่กล้าพูด',
    challenge: 'คุณจะทำอย่างไรให้ daily กลับมาเป็นของทีม',
  },
];

export default poScenario;
