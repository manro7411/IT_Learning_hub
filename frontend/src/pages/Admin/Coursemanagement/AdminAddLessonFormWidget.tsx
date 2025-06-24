import AdminSidebarWidget from "../Widgets/AdminSideBar";
function AdminAddLessonFormWidget() {
    return null;
}
const AdminAddLessonPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebarWidget />
            <main className="flex-1 p-10 space-y-6">
                <h1 className="text-2xl font-bold text-blue-800 border-b pb-2">
                    📚 Add New Lesson
                </h1>
                <AdminAddLessonFormWidget />
            </main>
        </div>
    );
};
export default AdminAddLessonPage;
