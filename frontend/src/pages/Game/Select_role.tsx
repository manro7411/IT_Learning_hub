import { useState } from 'react';
import SidebarWidget from '../../widgets/SidebarWidget';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const roles = [
  { label: '👩🏻‍💼 Product Owner', value: 'po' },
  { label: '👨🏻‍💻 Developer', value: 'dev' },
  { label: '🧑🏼‍🏫 Scrum Master', value: 'sm' },
];

const SelectRole = () => {
  const { t } = useTranslation("game");

  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (role: 'dev' | 'po' | 'sm') => {
  navigate(`/scenario/${role}/0`);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <SidebarWidget />

      <main className="flex-1 p-10 relative flex">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-10 bg-orange-400 w-12 h-10 rounded-xl shadow-md font-bold text-lg text-white"
        >
          &lt;&lt;
        </button>

        <div className="flex flex-col justify-center items-center w-1/2">
          <h1
            className="text-5xl font-extrabold text-center mb-10 text-blue-600"
            style={{
              fontFamily: '"Happy Monkey", cursive',
              textShadow: '2px 2px 6px rgba(0, 0, 255, 0.3)',
            }}
          >
            SELECT <br /> YOUR ROLE
          </h1>

          <button
            onClick={() => {
              if (selected) {
                navigate(`/scenario/${selected}/0`);
              }
            }}    
            disabled={!selected}
            className={`mt-4 px-10 py-3 rounded-full text-white text-xl font-bold shadow-md transition-all ${
              selected
                ? 'bg-green-400 hover:bg-green-500'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            style={{ fontFamily: '"Happy Monkey", cursive' }}
          >
            select
          </button>
        </div>

        <div className="flex flex-col items-center justify-center w-1/2 gap-6">
          <div className="border-4 border-blue-600 rounded-2xl p-5 bg-white shadow-2xl w-[470px]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="flex flex-col gap-4"
            >
              {roles.map((role) => {
                const isSelected = selected === role.value;
                return (
                  <motion.button
                    key={role.value}
                    onClick={() => setSelected(role.value)}
                    variants={{
                      hidden: { x: 100, opacity: 0 },
                      visible: { x: 0, opacity: 1 }
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`w-full px-8 py-4 text-white text-xl rounded-xl shadow-md ${
                      isSelected ? 'bg-blue-700' : 'bg-blue-500'
                    }`}
                  >
                    {role.label}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          <div className="font-syne text-base max-w-md text-left text-gray-700">
            <span className="text-blue-600 font-bold block mb-2">RESPONSIBILITIES:</span>
            <p><strong>PO:</strong> {t('poRole')}</p>
            <p><strong>Dev:</strong> {t('devRole')}</p>
            <p><strong>SM:</strong> {t('smRole')}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SelectRole;
