import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Authentication/AuthContext";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
import { useState, useContext, useEffect } from 'react';
import LanguageSwitcher     from '../../../components/LanguageSwitcher';

import { useTranslation } from 'react-i18next';

interface BlogForm {
  title:        string;
  coverFile:    File | null; /* cover */
  coverUrl:     string;  /* preview */
  date:         string;           
  content:      string;           
}

const INITIAL_FORM: BlogForm = {
  title:     '',
  coverFile: null,
  coverUrl:  '',
  date:      '',
  content:   '',
};

function AdminAddBlogPage() {
  const { t } = useTranslation('adminaddblog');        
  const { token } = useContext(AuthContext);
  const navigate  = useNavigate();

  const [form, setForm]         = useState<BlogForm>(INITIAL_FORM);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!token) navigate('/');
  }, [token, navigate]);
  
  const handleInput =
    (field: keyof BlogForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleCover = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(prev => ({
      ...prev,
      coverFile: file,
      coverUrl:  URL.createObjectURL(file),
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    
    const coverInput = document.getElementById('coverInput') as HTMLInputElement | null;
    if (coverInput) {
        coverInput.value = '';
    }
    };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* base64 หรือ multipart */
      let imageUrl = '';
      if (form.coverFile) {
        const data = new FormData();
        data.append('file', form.coverFile);
        const res  = await axios.post('/api/upload', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        imageUrl = res.data.url;  // backend return url
      }

      await axios.post(
        '/api/blogs',
        { ...form, coverUrl: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Blog created!");
      resetForm();
      navigate('/admin/blog/list');
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWidget />

      <main className="flex-1 p-10 space-y-6 relative">
        <div className="absolute top-6 right-10">
          <LanguageSwitcher />
        </div>

        <h1 className="text-2xl font-bold text-blue-800">{t('addBlog')}</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-8 max-w-3xl space-y-4"
        >
          <div>
            <label className="block text-base font-medium text-gray-700">{t('title')}</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={handleInput('title')}
              className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">{t('cover')}</label>
            {form.coverUrl && (
              <img src={form.coverUrl} alt="preview" className="h-40 w-auto mb-2 object-cover rounded" />
            )}
            <input
              id="coverInput"
              type="file"
              accept="image/*"
              onChange={handleCover}
              className="block"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">{t('content')}</label>
            <textarea
              rows={8}
              value={form.content}
              onChange={handleInput('content')}
              placeholder={t('write')}
              className="w-full mt-1 px-4 py-2 bg-gray-50 border rounded-lg resize-y"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">{t('date')}</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={handleInput('date')}
              className="mt-1 px-4 py-2 bg-gray-50 border rounded-lg"
            />
          </div>

          
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              )}
              {loading ? t('posting') : t('post')}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="bg-red-400 text-white px-8 py-2 rounded-lg hover:bg-red-500"
            >
              {t('reset')}
            </button>
          </div>
        </form>
      </main>

     
    </div>
  );
}

export default AdminAddBlogPage;
