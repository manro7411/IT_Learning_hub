import { useState } from "react";

const rewards = [
  { name: "Tumbler", points: 200 },
  { name: "Canvas Bag", points: 150 },
  { name: "Notebook", points: 100 },
];

type RewardProps = {
  userPoints: number;
};

const Reward = ({ userPoints }: RewardProps) => {
  const [redeemed, setRedeemed] = useState<string[]>([]);

  const handleRedeem = (itemName: string, itemPoints: number) => {
    if (userPoints >= itemPoints && !redeemed.includes(itemName)) {
      setRedeemed((prev) => [...prev, itemName]);
      alert(`คุณได้ Redeem ${itemName} เรียบร้อยแล้ว!`);
      // TODO: call API to save redemption
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Reward</h2>
      {rewards.map((item, i) => {
        const canRedeem = userPoints >= item.points;
        const isRedeemed = redeemed.includes(item.name);

        return (
          <div
            key={i}
            className="flex items-center justify-between bg-blue-100 px-6 py-4 rounded-full shadow text-sm"
          >
            <div>
              <div className="text-base font-semibold text-blue-800">{item.name}</div>
              <div className="text-xs text-blue-600">{item.points} points to redeem</div>
            </div>
            <button
              disabled={!canRedeem || isRedeemed}
              onClick={() => handleRedeem(item.name, item.points)}
              className={`px-4 py-1 rounded-full font-medium ${
                canRedeem && !isRedeemed
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isRedeemed ? "Redeemed" : "Redeem"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Reward;
