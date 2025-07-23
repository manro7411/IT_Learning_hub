import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useTranslation } from 'react-i18next';


interface RecommendedTopicsProps {
  topics: { id: string; title: string }[];
}

function RecommendedTopics({ topics }: RecommendedTopicsProps) {
  const { t } = useTranslation("userblog");
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full md:w-64">
      <h2 className="text-md font-semibold mb-2">
        {t('recommend')}<span className="ml-1">✨</span>
      </h2>
      <ul className="space-y-2 text-sm">
        {topics.map((topic) => (
            <li
            key={topic.id}
            className="flex items-start gap-2 cursor-pointer hover:underline"
            onClick={() => navigate(`/blogdetail/${topic.id}`)}
            >
            {/* custom bullet */}
            <span className="w-2 h-2 mt-1 bg-blue-600 rounded-full flex-shrink-0" />
            <span>{topic.title}</span>
            </li>
        ))}
        </ul>

    </div>
  );
}

export default RecommendedTopics
