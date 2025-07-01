import type { ScenarioItem } from '../types/Scenario';

const devScenario: ScenarioItem[] = [
  {
    title: 'Unclear User Story',
    background: ' คุณหยิบ Story มาทำ แต่เนื้อหายังไม่ชัดว่าต้องการอะไร และไม่มี Acceptance Criteria ครบถ้วน',
    challenge: 'คุณไม่อยากขัดจังหวะ PO และไม่แน่ใจว่า SM จะช่วยได้ไหม',
  },
  {
    title: 'PO Adding New Tasks During a Sprint',
    background: 'PO มาขอให้เพิ่ม Story ด่วนเข้ามา โดยไม่มีใน Sprint Plan',
    challenge: 'ทีมไม่ได้คุยเรื่องนี้มาก่อน และคุณเป็นคนว่างอยู่',
  },
  {
    title: 'Cross-Team Dependencies ',
    background: 'คุณเจอว่า feature ที่ทำจะต้องรอ API จากทีมอื่น ซึ่งยังไม่เสร็จ',
    challenge: 'คุณไม่อยาก idle หรือ block คนอื่น',
  },
  {
    title: 'Frequent Requirement Changes',
    background: 'คุณทำงานไปแล้วครึ่งหนึ่ง แต่ PO แจ้งว่าอยากเปลี่ยน flow ใหม่',
    challenge: ' คุณเริ่มรู้สึกเสียแรงและ demotivated',
  },
  {
    title: 'High Code Complexity ',
    background: 'Story ที่รับมาเจอปัญหาเชิงเทคนิค ต้องใช้ workaround หลายขั้น',
    challenge: 'คุณกลัวว่า refactor อาจไม่ทัน Sprint',
  },
];

export default devScenario;
