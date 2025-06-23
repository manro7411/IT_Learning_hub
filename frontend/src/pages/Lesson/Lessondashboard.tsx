import { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import CalendarWidget from '../../widgets/CalendarWidget';
import ScoreboardChart from '../../components/ScoreboardChart';
import Sidebar from '../../widgets/SidebarWidget';
import defaultUserAvatar from '../../assets/user.png';
interface Lesson {
    id: string;
    title: string;
    category: string;
    description?: string;
    thumbnailUrl?: string;
    authorName?: string;
    authorAvatarUrl?: string;
}
const LessonPage = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        axios
            .get('http://localhost:8080/learning')
            .then((res) => setLessons(res.data))
            .catch((err) => {
                console.error('❌ Failed to fetch lessons:', err);
                alert('Failed to fetch lessons');
            })
            .finally(() => setLoading(false));
    }, []);
    const handleLessonClick = async (id: string) => {
        try {
            await axios.post(`http://localhost:8080/learning/${id}/click`);
            navigate(`/lesson/${id}`);
        } catch (error) {
            console.error("Failed to log click:", error);
            navigate(`/lesson/${id}`); // Fallback navigation even if click fails
        }
    };
    const filteredLessons = lessons.filter(
        (lesson) =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lesson.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lesson.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full xl:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-3 grid gap-6 grid-cols-[repeat(auto-fill,minmax(256px,1fr))]">
                        {loading ? (
                            <div className="text-gray-500">Loading lessons...</div>
                        ) : filteredLessons.length === 0 ? (
                            <div className="text-gray-500">No lessons found</div>
                        ) : (
                            filteredLessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    onClick={() => handleLessonClick(lesson.id)}
                                    className="block focus:outline-none focus-visible:ring-0 cursor-pointer"
                                >
                                    <div className="w-64 h-[300px] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                                        {/* Thumbnail */}
                                        <div className="w-full h-32 bg-gray-100">
                                            <img
                                                src={lesson.thumbnailUrl || '/placeholder.png'}
                                                alt={lesson.title}
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder.png';
                                                }}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="p-4 flex flex-col flex-1">
                                            <span className="text-[10px] font-semibold text-purple-600 uppercase">
                                                {lesson.category}
                                            </span>
                                            <h3 className="text-sm font-semibold mt-1 line-clamp-2">
                                                {lesson.title}
                                            </h3>

                                            <div className="h-1 bg-gray-200 rounded-full mt-3 mb-2">
                                                <div className="h-full bg-blue-500 rounded-full w-[60%]" />
                                            </div>

                                            <div className="mt-auto flex items-center space-x-2">
                                                <img
                                                    src={lesson.authorAvatarUrl || defaultUserAvatar}
                                                    alt="Author avatar"
                                                    onError={(e) => {
                                                        e.currentTarget.src = defaultUserAvatar;
                                                    }}
                                                    className="w-7 h-7 rounded-full object-cover"
                                                />
                                                <div>
                                                    <div className="text-xs font-medium">
                                                        {lesson.authorName || 'Unknown Author'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500">
                                                        Learning Content
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
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