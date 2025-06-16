// src/components/Sidebar.tsx
import Logo from '../assets/logo.png'; // Adjust the path as necessary

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-6 m-4 rounded-xl flex flex-col justify-between">
      <div>
        <img src={Logo} alt="Bangkok Bank Logo" className="h-12 mb-8" />
        <nav className="space-y-4 text-sm">
          {['Dashboard', 'Inbox', 'Lesson', 'Task', 'Group', 'Point', 'Game'].map((item, i) => (
            <div
              key={i}
              className={`${
                item === 'Dashboard' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              {item}
            </div>
          ))}
        </nav>

        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">FRIENDS</h3>
          <div className="space-y-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Firstname Lastname</div>
                    <div className="text-xs text-gray-500">Software Developer</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="text-sm space-y-2">
        <div className="flex items-center space-x-2 text-gray-700">
          <span>⚙️</span> <span>Settings</span>
        </div>
        <div className="flex items-center space-x-2 text-red-500">
          <span>🚪</span> <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
