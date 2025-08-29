import { useNavigate } from "react-router-dom";

interface Course {
  id:string
  title: string;
  status: string;
  progress: number;
  startDate: string;
  dueDate: string;
}

interface CourseProgressTableProps {
  courses: Course[];
}

const CourseProgressTable = ({ courses }: CourseProgressTableProps) => {
    const navigate = useNavigate();
    const handleTitleClick = (id: string) => {
      navigate(`/lesson/${id}`);
    };
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Course Progress</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-sm text-gray-600 border-b">
            <th className="py-2">Course</th>
            <th className="py-2">Status</th>
            <th className="py-2">Progress</th>
            <th className="py-2">Start Date</th>
            <th className="py-2">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index} className="text-sm text-gray-800 border-b">
              <td className="py-2 cursor-pointer text-blue-600 hover:text-sky-700" onClick={()=> handleTitleClick(course.id)}>{course.title}</td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    course.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : course.status === "In Progress"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {course.status}
                </span>
              </td>
              <td className="py-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </td>
              <td className="py-2">{course.startDate}</td>
              <td className="py-2">{course.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseProgressTable;