import { type FC } from "react";

interface TeamCardProps {
  name: string;
  description: string;
  createBy: string;
  joinCode: string;
  onClick?: () => void;
}

const TeamCardWidget: FC<TeamCardProps> = ({ name, description, createBy, joinCode, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow p-4 space-y-2 hover:shadow-lg hover:bg-gray-50 transition cursor-pointer"
    >
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600 text-sm">{description || "No description"}</p>
      <div className="text-xs text-gray-500 pt-2">
        <p>Created by: {createBy}</p>
        <p>Join Code: {joinCode}</p>
      </div>
    </div>
  );
};

export default TeamCardWidget;
