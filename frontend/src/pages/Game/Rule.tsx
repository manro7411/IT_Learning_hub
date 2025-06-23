import SidebarWidget from '../../widgets/SidebarWidget';
import { useNavigate } from 'react-router-dom';

const Rule = () => {
  const navigate = useNavigate();

  const ruleSteps = [
    { step: 1, title: 'Start the Game', description: <>Click <span className="bg-green-400 px-2 py-0.5 rounded-lg text-sm font-happy text-white">start</span> on the main screen</> },
    { step: 2, title: 'Choose Your Role', description: 'with different responsibilities and challenges: Dev, PO, SM' },
    { step: 3, title: 'Sprint Planning', description: 'Consider the importance, difficulty, and estimated effort for each task.' },
    { step: 4, title: 'Face Sprint Events', description: 'Read the scenario and select the most appropriate action from the choices.' },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      <SidebarWidget />

      <main className="flex-1 p-10 relative font-sans">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: '"Happy Monkey", cursive' }}>See where you are!</h1>
          <div className="flex gap-4">
            <button
              className="bg-green-400 text-white font-bold text-2xl px-[90px] py-[30px] rounded-xl cursor-default"
              style={{ fontFamily: '"Happy Monkey", cursive' }}
              disabled
            >
              rule
            </button>
            <button
              className="bg-green-400 text-white font-bold text-2xl px-[90px] py-[30px] rounded-xl cursor-default"
              style={{ fontFamily: '"Happy Monkey", cursive' }}
              disabled
            >
              start
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative bg-gray-100 p-10 rounded-xl shadow-lg flex">
          
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-orange-400 w-12 h-10 rounded-xl text-white shadow-md font-bold text-lg"
          >
            &lt;&lt;
          </button>

          <div className="absolute  top-1/2 transform -translate-y-1/2 rotate-[-4deg]">
            <div
              className="bg-blue-600 text-white text-4xl font-bold px-[65px] py-8 rounded-lg shadow-md w-fit leading-tight"
              style={{ fontFamily: '"Happy Monkey", cursive' }}
            >
              RULES OF<br />THE GAME
            </div>
          </div>

        {/* rule steps */}
        <div className="ml-80  w-lg space-y-6">
            {ruleSteps.map((step, i) => (
                <div
                    key={i}
                    className="relative"
                    style={{ marginLeft: `${i * 40}px` }}
                >
                  
                    <div className="absolute top-2 left-4 right-4 w-full h-full bg-orange-400 rounded-xl shadow-inner z-0"></div>

                    <div className="relative bg-orange-300 px-5 py-3 rounded-xl shadow-lg flex items-start gap-4 z-10">
                        <div className="bg-blue-700 text-white w-10 aspect-square rounded-full flex items-center justify-center text-2xl self-center font-happy">
                            {step.step}
                        </div>

                    <div className="font-syne">
                        <div className="text-2xl text-blue-700">{step.title}</div>
                        <div className="text-base mt-1 text-gray-700">{step.description}</div>
                    </div>
                </div>
            </div>
            ))}

        </div>

        </div>
      </main>
    </div>
  );
};

export default Rule;
