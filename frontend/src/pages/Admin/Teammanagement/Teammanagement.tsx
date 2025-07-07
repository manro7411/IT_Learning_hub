import { useState } from "react";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
import CreateTeamModal from "../Components/CreateTeamModal";
import { Plus } from "lucide-react";

const TeamManagement = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWidget />
      <main className="flex-1 p-6 relative">
        <h1 className="text-3xl font-bold mb-4">Team Management</h1>
        <p className="text-gray-600 mb-8">Manage teams and members efficiently.</p>

        {/* Floating button */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          <Plus size={24} />
        </button>

        {/* Modal */}
        <CreateTeamModal open={showModal} onClose={() => setShowModal(false)} />
      </main>
    </div>
  );
};

export default TeamManagement;
