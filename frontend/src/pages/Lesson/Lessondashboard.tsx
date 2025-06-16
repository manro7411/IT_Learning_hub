
import CalendarWidget from '../../widgets/CalendarWidget';
import ScoreboardChart from '../../components/ScoreboardChart';
import agileImg from '../../assets/agileImg.png';
import scrumImg from '../../assets/scrumImg.png';
import waterfallImg from '../../assets/waterfallImg.png';
import Sidebar from '../../widgets/SidebarWidget';

const lessons = [
  {
    title: 'Agile Methodologies Overview',
    tag: 'AGILE',
    author: 'Firstname Lastname',
    role: 'Software Developer',
    image: agileImg,
  },
  {
    title: 'Scrum Methodologies Overview',
    tag: 'SCRUM',
    author: 'Firstname Lastname',
    role: 'Software Developer',
    image: scrumImg,
  },
  {
    title: '10 Advantage Of Waterfall Model',
    tag: 'AGILE',
    author: 'Firstname Lastname',
    role: 'Software Developer',
    image: waterfallImg,
  },
];

const LessonPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Lessons Grid */}
          <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 order-2 xl:order-1">
            {Array(3)
              .fill(lessons)
              .flat()
              .map((lesson, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <img src={lesson.image} alt={lesson.title} className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <span className="text-xs text-purple-600 font-semibold uppercase">{lesson.tag}</span>
                    <h3 className="text-sm font-semibold mt-1">{lesson.title}</h3>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium">{lesson.author}</div>
                        <div className="text-xs text-gray-500">{lesson.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Calendar and Scoreboard */}
          <div className="order-1 xl:order-2 space-y-6">
            <CalendarWidget />
            <ScoreboardChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;