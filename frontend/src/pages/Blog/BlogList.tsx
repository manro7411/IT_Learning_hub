import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from '../../widgets/SidebarWidget';
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useTranslation } from 'react-i18next';

import agileBlogImage from '../../assets/agileblog.png';
import scrumBlogImage from '../../assets/scrumblog.png'; 
import waterfallBlogImage from '../../assets/waterfallblog.png';
import RecommendedTopics from "../Blog/RecommendedTopics";

interface BlogPreview {
  id: string;
  title: string;
  coverUrl: string;
  date: string;
}

const MOCK_BLOGS: BlogPreview[] = [
  {
    id: "1",
    title: "Introduction to Agile",
    coverUrl: agileBlogImage,
    date: "2025-07-15",
  },
  {
    id: "2",
    title: "Scrum 101: Roles & Events",
    coverUrl: scrumBlogImage,
    date: "2025-07-14",
  },
  {
    id: "3",
    title: "Waterfall Model Explained",
    coverUrl: waterfallBlogImage,
    date: "2025-07-13",
  },
];

function BlogListPage() {
  const { t } = useTranslation("userblog");
  const navigate = useNavigate();
  const [blogs] = useState<BlogPreview[]>(MOCK_BLOGS);

  const recommendedTopics = [
    { id: "2", title: "Scrum 101: Roles & Events" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Layout ซ้าย-ขวา */}
      <div className="p-6 w-full flex flex-col md:flex-row gap-6 justify-between relative">
        {/* Blog list ด้านซ้าย */}
        <div className="space-y-6 flex-1">
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-sm text-gray-500">{t('latest')}</p>

          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => navigate(`/blogdetail/${blog.id}`)}
                className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md transition flex p-4 gap-6 items-center"
              >
                <img
                  src={blog.coverUrl}
                  alt={blog.title}
                  className="w-32 h-24 object-cover rounded-md"
                />
                <div className="flex flex-col items-start">
                  <h2 className="text-lg font-bold text-gray-800">
                    {blog.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 space-x-2">
                    <span className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <span>Author</span>
                    </span>
                    <span>{blog.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Topics ด้านขวา */}
        <div className="shrink-0 mt-24">
          <RecommendedTopics topics={recommendedTopics} />
        </div>

        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-10">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

export default BlogListPage;