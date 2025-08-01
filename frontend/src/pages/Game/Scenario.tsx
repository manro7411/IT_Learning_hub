import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SidebarWidget from '../../widgets/SidebarWidget';
import TeamImage from '../../assets/team.png';
import QuestionImage from '../../assets/question.png';

const Scenario = () => {
  const { role, scenarioIndex } = useParams<{ role: string; scenarioIndex: string }>();
  const navigate = useNavigate();
  const scenarioList = role 
  const scenarioIdx = parseInt(scenarioIndex || '0', 10);
  const currentScenario = Array.isArray(scenarioList) ? scenarioList[scenarioIdx] : null;
  const location = useLocation();
  const { correctCount = 0, total = scenarioIdx + 1 } = location.state || {};

  if (!currentScenario || !scenarioList) {
    return (
      <div className="p-10 text-red-600 font-bold">
        Nothing found for this scenario.
      </div>
    );
  }

  const handleNext = () => {
    navigate(`/question/${role}/${scenarioIdx}`, {
      state: {
        correctCount,
        total,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex">
      <SidebarWidget />

      <main className="flex-1 p-10 flex font-sans relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-10 bg-orange-400 w-12 h-10 rounded-xl shadow-md font-bold text-lg text-white"
        >
          &lt;&lt;
        </button>

        <div className="w-1/3 flex flex-col justify-center items-start pr-8">
          <h1
            className="text-4xl text-center font-bold leading-tight mb-10 text-blue-600"
            style={{
              fontFamily: '"Happy Monkey", cursive',
              textShadow: '2px 2px 6px rgba(0, 0, 255, 0.3)',
            }}
          >
            {currentScenario.title}
          </h1>

          <button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold px-10 py-2 rounded-full shadow-md ml-24"
            style={{ fontFamily: '"Happy Monkey", cursive' }}
          >
            Next
          </button>
        </div>

        <div className="w-2/3 flex flex-col gap-6">
          <div className="flex gap-6 items-stretch">
            <div className="flex-1">
              <img
                src={TeamImage}
                alt="Team"
                className="w-full h-full object-cover rounded-xl border-4 border-blue-600"
              />
            </div>
            <div className="flex-1 border-4 border-blue-600 rounded-xl p-6 bg-white shadow-md flex flex-col justify-between">
              <h2
                className="text-xl font-bold mb-2"
                style={{ fontFamily: '"Happy Monkey", cursive' }}
              >
                💬 Background:
              </h2>
              <p className="text-base text-gray-800 font-syne mb-24">
                {currentScenario.background}
              </p>
            </div>
          </div>

          
          <div className="flex gap-6 items-stretch">
            <div className="flex-1">
              <img
                src={QuestionImage}
                alt="Question"
                className="w-full h-full object-cover rounded-xl border-4 border-orange-400"
              />
            </div>
            <div className="flex-1 border-4 border-orange-400 rounded-xl p-6 bg-white shadow-md flex flex-col justify-start">
              <h2
                className="text-xl font-bold mb-2"
                style={{ fontFamily: '"Happy Monkey", cursive' }}
              >
                💥 Challenge:
              </h2>
              <p className="text-base text-gray-800 font-syne">
                {currentScenario.challenge}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scenario;
