import { useEffect, useState } from 'react';
import axios from 'axios';

export const useUserScore = (token: string | null) => {
  const [overallScore, setOverallScore] = useState<number>(0);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    if (!token) return;

    const fetchOverallScore = async () => {
      try {
        const res = await axios.get('/api/user/progress/scores/total', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setOverallScore(res.data.overallScore);
          setUserEmail(res.data.userEmail);
        }
        else if(res.status == 401){
            throw new Error("Invalid Credentials")
        }
      } catch (error) {
        console.error('Something went wrong:', error);
      }
    };

    fetchOverallScore();
  }, [token]);

  return { overallScore, userEmail };
};
