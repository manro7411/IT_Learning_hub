import { useParams } from "react-router-dom";
import Sidebar from '../../widgets/SidebarWidget';
import agileBlogImage from '../../assets/agileblog.png';
import scrumBlogImage from '../../assets/scrumblog.png';
import waterfallBlogImage from '../../assets/waterfallblog.png';

const blogs = [
  {
    id: "1",
    title: "Why Agile Works for Modern Teams",
    coverUrl: agileBlogImage,
    date: "2025-07-15",
    content: [
      "Agile is more than just a buzzword—it's a mindset that allows teams to respond quickly to change.",
      "With short iterations, continuous feedback, and constant improvement, Agile empowers teams to deliver value faster while staying closely aligned with customer needs.",
      "Key Benefits:",
      "• Fast feedback loops",
      "• Flexible scope management",
      "• Better stakeholder collaboration",
    ],
  },
  {
    id: "2",
    title: "Understanding Scrum Roles",
    coverUrl: scrumBlogImage,
    date: "2025-07-11",
    tag: "scrum",
    content: [
      "Scrum is one of the most widely used Agile frameworks, but its success depends on clearly defined roles.",
      "There are three key roles:",
      "• Product Owner – Defines and prioritizes the work (Product Backlog)",
      "• Scrum Master – Facilitates the process, removes obstacles",
      "• Development Team – Builds and delivers the product increment",
      "Each role contributes differently, but collaboration between all three is the key to success.",
      "📌 Want to dive deeper? Try role-playing exercises with your team to simulate Scrum ceremonies!",
    ],
  },
  {
    id: "3",
    title: "When to Use the Waterfall Model",
    coverUrl: waterfallBlogImage,
    date: "2025-07-13",
    tag: "waterfall",
    content: [
      "Waterfall is a linear project management model where each phase must be completed before the next begins.",
      "While it's considered less flexible than Agile, it's still ideal for:",
      "• Projects with fixed requirements",
      "• Regulatory environments (e.g., medical or government)",
      "• Short, well-defined scope",
      "💡 Tip: For projects like building a bridge or medical devices, Waterfall can offer clarity, structure, and traceability.",
    ],
  },
];

function BlogDetailPage() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);

  if (!blog) return <div className="p-8">Blog not found.</div>;

  // แยกเนื้อหาออกเป็น block list หรือ paragraph
  const renderContent = () => {
    const elements = [];
    let listItems: string[] = [];

    blog.content.forEach((line, idx) => {
      if (line.startsWith("•")) {
        listItems.push(line.slice(1).trim());
      } else {
        if (listItems.length > 0) {
          elements.push(
            <ul key={`ul-${idx}`} className="list-disc list-inside mt-2 space-y-1">
              {listItems.map((item, i) => (
                <li key={`li-${idx}-${i}`}>{item}</li>
              ))}
            </ul>
          );
          listItems = [];
        }
        elements.push(<p key={`p-${idx}`} className="mb-2">{line}</p>);
      }
    });

    // หากจบบรรทัดสุดท้ายเป็น list
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-end`} className="list-disc list-inside mt-2 space-y-1">
          {listItems.map((item, i) => (
            <li key={`li-end-${i}`}>{item}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="p-8 w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">{blog.title}</h1>
        <div className="flex justify-center items-center text-sm text-gray-600 gap-3 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            Author
          </span>
          <span>{blog.date}</span>
        </div>

        <img src={blog.coverUrl} alt={blog.title} className="w-2/3 max-w-md h-auto mx-auto mb-6 rounded-lg" />

        <div className="text-gray-800 text-lg space-y-2">{renderContent()}</div>
      </div>
    </div>
  );
}

export default BlogDetailPage;