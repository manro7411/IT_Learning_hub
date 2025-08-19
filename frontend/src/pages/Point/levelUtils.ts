export const getLevelInfo = (overallScore: number) => {
  if (overallScore < 10) {
    return {
      label: "🔰 Beginner",
      progress: (overallScore / 10) * 100,
      current: overallScore,
      max: 10,
    };
  } else if (overallScore < 20) {
    return {
      label: "🥉 Bronze",
      progress: ((overallScore - 10) / 10) * 100,
      current: overallScore - 10,
      max: 10,
    };
  } else if (overallScore < 35) {
    return {
      label: "🥈 Silver",
      progress: ((overallScore - 20) / 15) * 100,
      current: overallScore - 20,
      max: 15,
    };
  } else if (overallScore < 50) {
    return {
      label: "🥇 Gold",
      progress: ((overallScore - 35) / 15) * 100,
      current: overallScore - 35,
      max: 15,
    };
  } else {
    return {
      label: "💎 Platinum",
      progress: 100,
      current: 15,
      max: 15,
    };
  }
};
