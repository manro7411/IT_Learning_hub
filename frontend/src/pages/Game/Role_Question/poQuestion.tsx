import type { QuestionItem } from '../types/Question';

const devQuestion: QuestionItem[][] = [
  [
    {
      question: 'ในฐานะ Product Owner คุณจะทำอย่างไร?',
      choices: [
        'บอกให้ทำตาม backlog ไปก่อน',
        'หยุด Sprint และทำ goal ใหม่',
        'ทำ retrospective ทันที',
        'ประชุมด่วนจัด Sprint Goal ร่วมกัน',
      ],
      correctAnswerIndex: 3,
    }
  ],
  [
    {
      question: 'ในฐานะ Product Owner คุณจะทำอย่างไร?',
      choices: [
        'ส่งวิดีโอ demo พร้อมแบบสอบถามให้ stakeholder หลัง review',
        'นัด review แยกเฉพาะ stakeholder หลัง Sprint review',
        'บอก stakeholder ว่าจะไม่รับฟีเจอร์ใด ๆ จากเขาใน Sprint ถัดไป',
        'หยุดทำ review ไปก่อน แล้ว focus เฉพาะ internal',
      ],
      correctAnswerIndex: 0,
    }
  ],
  [
    {
      question: 'ในฐานะ Product Owner คุณจะทำอย่างไร?',
      choices: [
        'เตรียม story มาให้เสร็จ แล้วแค่ให้ทีม estimate',
        'เปลี่ยน refinement เป็น async ผ่านช่องทางแชทแทน',
        'เริ่มต้นแต่ละ refinement ด้วยการให้ทีมตั้งคำถามหรือ scenario ที่น่าจะเจอ',
        'ลดจำนวน refinement ลง แล้วใช้เวลานั้นคุยกับ stakeholder แทน',
      ],
      correctAnswerIndex: 2,
    }
  ],
  [
    {
      question: 'ในฐานะ Product Owner คุณจะทำอย่างไร?',
      choices: [
        'อนุญาต story ที่ยังไม่ชัดเจนเข้า Sprint เพื่อให้ทีมไม่ idle',
        'หยิบเฉพาะ story ที่ ready แม้จะทำให้ Sprint ดูเบาบาง',
        'บอกทีมว่าเราจะเติมงานเข้า Sprint ระหว่าง Sprint ถ้าทำเร็ว',
        'ยืม story จาก Sprint ถัดไปที่ยังไม่คุย detail มาใส่แทน',
      ],
      correctAnswerIndex: 1,
    }
  ],
  [
    {
      question: 'ในฐานะ Product Owner คุณจะทำอย่างไร?',
      choices: [
        'ใส่ story ใหม่ทันที',
        'ห้ามใส่เด็ดขาด',
        'ขอยืมงานจาก Sprint ถัดไป',
        'ถามทีมว่าอยากดึง backlog item ไหนเพิ่ม และให้ทีมเลือก',
      ],
      correctAnswerIndex: 3,
    }
  ]

];

export default devQuestion;
