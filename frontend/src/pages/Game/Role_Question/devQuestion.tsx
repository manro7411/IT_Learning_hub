import type { QuestionItem } from '../types/Question';

const devQuestion: QuestionItem[][] = [
  [
    {
      question: 'ในฐานะ Developer คุณจะทำอย่างไร?',
      choices: [
        'เดา scope แล้วเริ่มทำ เพื่อไม่ให้เสียเวลา',
        'ส่งข้อความถาม PO ทันที ไม่รอ refinement',
        'แจ้งใน Daily ว่า Story นี้ยังไม่พร้อม และขอให้คุยกับ PO ก่อน',
        'เลื่อนไปทำ Story อื่นที่ง่ายกว่า แล้วปล่อยเรื่องนี้ไว้ก่อน',
      ],
      correctAnswerIndex: 2,
    }
  ],
  [
    {
      question: 'ในฐานะ Developer คุณจะทำอย่างไร?',
      choices: [
        'รับ Story มาเลย เพราะงานเร่ง',
        'ปฏิเสธทันที เพราะเป็นขัดหลัก Scrum',
        'แจ้ง Scrum Master และทีมเพื่อพิจารณาโดยรวม',
        'ทำแบบลับ ๆ เผื่อช่วยลดความกดดัน',
      ],
      correctAnswerIndex: 2,
    }
    // เพิ่มคำถามใน scenario 1 ได้ตรงนี้
  ],
  [
    {
      question: 'ในฐานะ Developer คุณจะทำอย่างไร?',
      choices: [
        'สร้าง mock API เอง แล้วค่อยเปลี่ยนทีหลัง',
        'รอให้ API พร้อม แล้วค่อยเริ่มทำ',
        'ทำส่วนอื่นก่อน แล้วทิ้งส่วนนี้ไว้',
        'แจ้งทีมให้ re-prioritize Story นี้',
      ],
      correctAnswerIndex: 0,
    }
  ],
  [
    {
      question: 'ในฐานะ Developer คุณจะทำอย่างไร?',
      choices: [
        'บอกว่า Sprint นี้ขอไม่เปลี่ยนอะไรแล้ว',
        'หารือในทีมว่า effort ที่เสียไปมีทาง reuse ได้ไหม',
        'เปลี่ยนตามทันที เพื่อไม่ให้ PO เสียใจ',
        'ทำตามของเดิมให้เสร็จ แล้วส่งให้ PO ตัดสินใจ',
      ],
      correctAnswerIndex: 1,
    }
  ],
  [
    {
      question: 'ในฐานะ Developer คุณจะทำอย่างไร?',
      choices: [
        'เขียนแบบ workaround ไปก่อน เพื่อให้ demo ได้',
        'แจ้งใน Daily แล้วเสนอ refactor พร้อม impact เวลา',
        'ถาม Scrum Master ว่าควรทำแบบไหน',
        'ทำไปเงียบ ๆ แล้วแก้หลังจาก demo',
      ],
      correctAnswerIndex: 1,
    }
  ],
];

export default devQuestion;
