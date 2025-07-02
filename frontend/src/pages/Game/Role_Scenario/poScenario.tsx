import type { ScenarioItem } from '../types/Scenario';

const poScenario: ScenarioItem[] = [
  {
    title: 'Misalignment of Sprint Goals',
    background: 'กลาง Sprint ทีม Dev ถามคุณว่า Sprint นี้เป้าหมายคืออะไร เพราะงานกระจัดกระจาย',
    challenge: 'ทีมไม่มี alignment กับ Sprint Goal',
  },
  {
    title: 'Lack of Key Feedback During the Sprint Reviews',
    background: 'Stakeholder หลักไม่สามารถเข้าร่วม Sprint Review ได้เป็นครั้งที่ 3 ติดต่อกัน งาน demo จึงมีแต่ทีมดูเอง',
    challenge: 'จะรับมืออย่างไรโดยไม่ให้กระทบ feedback loop?',
  },
  {
    title: 'Low Level of Team Engagement',
    background: 'Backlog refinement มีคนเข้าไม่ครบ หรือเข้าแล้วเงียบ ทีมให้เหตุผลว่า “ไม่รู้ว่า PO จะเอาอะไรอยู่ดี”',
    challenge: 'จะทำอย่างไรให้ refinement มีคุณค่า และไม่รู้สึกเหมือน “บรรยายจาก PO ฝ่ายเดียว”',
  },
  {
    title: 'Uncertainty in User Story Prioritization',
    background: 'ใน Sprint Planning ทีมอยากใส่หลาย story ที่ “อาจมีประโยชน์” แม้บางอันยังไม่มี acceptance criteria ครบถ้วน เพราะกลัว Sprint ว่าง',
    challenge: 'คุณจะ balance ระหว่าง focus กับ flexibility อย่างไร?',
  },
  {
    title: 'Development Team Selection of the Next User Story',
    background: 'ทีม Dev ทำงานเสร็จเร็ว แล้วขอ story เพิ่มกลาง Sprint',
    challenge: 'ควรทำอย่างไรให้ยังคงหลัก Scrum แต่ไม่เสีย momentum?',
  },
];

export default poScenario;
