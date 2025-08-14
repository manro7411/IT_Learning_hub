import { type FC, useState } from "react";
import { Clipboard, Check } from "lucide-react";

interface TeamCardProps {
  name: string;
  description: string;
  createBy: string;
  joinCode: string;
  onClick: () => void;
}

const TeamCardWidget: FC<TeamCardProps> = ({
  name,
  description,
  createBy,
  joinCode,
  onClick,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied after 2s
    } catch (err) {
      console.error("Failed to copy join code:", err);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow p-4 space-y-2 hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600 text-sm">
        {description || "No description"}
      </p>
      <div className="text-xs text-gray-400">Created by: {createBy}</div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Join Code: {joinCode}</span>
        <button
          onClick={(e) => {
            console.log(onClick)
            e.stopPropagation(); // Prevent triggering onClick for the card
            handleCopy();
          }}
          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
        >
          {copied ? <Check size={16} /> : <Clipboard size={16} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
};

export default TeamCardWidget;
