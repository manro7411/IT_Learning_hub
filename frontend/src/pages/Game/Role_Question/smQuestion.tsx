import type { QuestionItem } from '../types/Question';

const devQuestion: QuestionItem[][] = [
  [
    {
      question: 'ในฐานะ Scrum Master คุณจะทำอย่างไร?',
      choices: [
        'เตือน PO ตรง ๆ ให้ฟังทีมมากขึ้น',
        'เปิดโอกาสให้ทีมสะท้อนความคิดแบบนิรนาม หรือคุยแยกใน session ที่ปลอดภัย',
        'บอกให้ทีมปรับตัวกับสไตล์ของ PO',
        'รอ retrospective แล้วค่อย feedback',
      ],
      correctAnswerIndex: 1,
    }
  ],
  [
    {
      question: 'ในฐานะ Scrum Master คุณจะทำอย่างไร?',
      choices: [
        'เปิด discussion ระหว่าง refinement ให้ทีมเสนอ technical approach โดยยึดโจทย์จาก PO',
        'แจ้ง PO ว่าไม่ควรแตะเรื่องเทคนิค',
        'ลบ detail ทางเทคนิคออกก่อน Sprint Planning',
        'บอกทีมว่าต้องเคารพ business requirement',
      ],
      correctAnswerIndex: 0,
    }
  ],
  [
    {
      question: 'ในฐานะ Scrum Master คุณจะทำอย่างไร?',
      choices: [
        'แนะนำให้ใช้ timebox และให้ทีมช่วยกันจับเวลา',
        'ตัดจบคนที่พูดเกิน 2 นาที',
        'บอกว่าต้องพูดให้เสร็จใน 5 คำ',
        'เปลี่ยนไปใช้ async standup ผ่าน chat',
      ],
      correctAnswerIndex: 0,
    }
  ],
  [
    {
      question: 'ในฐานะ Scrum Master คุณจะทำอย่างไร?',
      choices: [
        'พูดแทรกทันทีกลาง planning ว่า team velocity ต่ำกว่านี้',
        'เปิด session แยกเพื่อให้ทีมแชร์ความรู้สึก แล้วนำ feedback ไปคุยกับ PO',
        'พูดคุยกับ PO ล่วงหน้าก่อน planning รอบต่อไป',
        'รอ retrospective แล้วค่อยให้ทีมสะท้อนเอง',
      ],
      correctAnswerIndex: 1,
    }
  ],
  [
    {
      question: 'ในฐานะ Scrum Master คุณจะทำอย่างไร?',
      choices: [
        'คุยกับ PO ว่าให้รอฟังช่วงอื่นแทน',
        'หยุด PO กลางวงและบอกว่าไม่ใช่ format ที่ถูกต้อง',
        'นัดคุยกับ PO หลังจบ เพื่อสะท้อนว่าทีมเริ่มอึดอัด',
        'ปล่อยไปก่อน แล้วถกใน retrospective',
      ],
      correctAnswerIndex: 2,
    }
  ],
];

export default devQuestion;
