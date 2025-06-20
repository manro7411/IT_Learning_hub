import SidebarWidget from '../../widgets/SidebarWidget';
import { useNavigate } from 'react-router-dom'



const leaderboardData = [
  { username: '@sr1809', rank: 4, score: 400 },
  { username: '@ayush123', rank: 5, score: 367 },
  { username: '@ruchi4567', rank: 6, score: 340 },
  { username: '@frenny56789', rank: 7, score: 320 },
  { username: '@vijay678', rank: 8, score: 318 },
  { username: '@brinda670988', rank: 9, score: 310 },
];

const getMedalColor = (medal: string) => {
  switch (medal) {
    case 'gold':
      return 'bg-orange-300';
    case 'silver':
      return 'bg-orange-300';
    case 'bronze':
      return 'bg-orange-300';
    
  }
};

const Gamedashboard = () => {
  const navigate = useNavigate();  
  return (
    <div className="min-h-screen bg-white flex font-sans">

      <SidebarWidget />

      {/* Main */}
      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: '"Happy Monkey", cursive' }}
          >
            See where you are!
          </h1>

          <div className="flex gap-4">
            <button
                onClick={() => navigate('/rule')}
                className="bg-green-400 hover:bg-green-500 text-white font-bold text-2xl px-[90px] py-[30px] text-2xl rounded-xl"
                style={{ fontFamily: '"Happy Monkey", cursive' }}
            >
                rule
            </button>
            <button
                onClick={() => navigate('/select-role')}
                className="bg-green-400 hover:bg-green-500 text-white font-bold text-2xl px-[90px] py-[30px] text-2xl rounded-xl"
                style={{ fontFamily: '"Happy Monkey", cursive' }}
            >
                start
            </button>

            

          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-6 flex items-center gap-2 text-lg font-syne">
          <span>Showing :</span>
          <select className="border rounded px-4 py-1">
            <option>Overall</option>
          </select>
        </div>

        {/* Top 3 Medals */}
        <div className="grid grid-cols-3 items-end mb-10 font-syne">
        
            <div className="flex justify-start">
                <div className={`text-center rounded-xl px-[120px] py-1 shadow-md ${getMedalColor('silver')}`}>
                    <div className="text-3xl font-bold mb-2">🥈</div>
                    <div className="text-lg ">ghr678</div>
                 </div>
            </div>

            <div className="flex justify-center">
                <div className="scale-110 z-10 text-center rounded-xl px-[95px] py-2 shadow-md bg-orange-300">
                    <div className="text-3xl font-bold mb-2">🥇</div>
                    <div className="text-lg ">sneha1809</div>
                </div>
            </div>

            <div className="flex justify-end">
                <div className={`text-center rounded-xl px-[120px] py-1 shadow-md ${getMedalColor('bronze')}`}>
                    <div className="text-3xl font-bold mb-2">🥉</div>
                    <div className="text-lg ">br7609</div>
                </div>
            </div>
    </div>
    
        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-x-16 text-left font-bold text-xl border-b mb-2 pb-2 font-syne">
            <div>Username</div>
            <div>Rank</div>
            <div>Score</div>
        </div>


        {/* Leaderboard Table */}
        <div className="space-y-2 font-syne">
          {leaderboardData.map((player, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1.5fr_1fr_1fr] gap-x-28 text-left  p-3 rounded-xl text-lg ${
                i % 2 === 0 ? 'bg-blue-200' : 'bg-blue-100'
              }`}
            >
              <div>{player.username}</div>
              <div>{player.rank}</div>
              <div>{player.score}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Gamedashboard;
