import { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";

const JoinTeamWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const joinCode = digits.join("");
  const userId = "ratchanon@gmail.com"; // TODO: replace with real user from auth context
  const userName = "Ratchanon Traitiprat";

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resetForm = () => setDigits(Array(6).fill(""));

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (!/^\d{6}$/.test(joinCode)) {
      alert("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/teams/joining", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinCode, userId, userName }),
      });

      const message = await response.text();

      if (!response.ok) {
        throw new Error(message || "Unknown error");
      }

      alert(`✅ Success: ${message}`);
      handleClose();

    } catch (error: unknown) {
      console.error(error);
      alert(`❌ Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <JoinTeamCard onOpen={() => setIsOpen(true)} />
      <JoinTeamDialog
        isOpen={isOpen}
        onClose={handleClose}
        digits={digits}
        isLoading={isLoading}
        onDigitChange={handleChange}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
        inputRefs={inputRefs}
      />
    </>
  );
};

const JoinTeamCard = ({ onOpen }: { onOpen: () => void }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-4">Join a Team</h2>
    <p className="text-gray-600 mb-4">Join a team to collaborate on projects and assignments.</p>
    <button
      onClick={onOpen}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Join Team
    </button>
  </div>
);

const JoinTeamDialog = ({
  isOpen,
  onClose,
  digits,
  isLoading,
  onDigitChange,
  onKeyDown,
  onSubmit,
  inputRefs,
}: {
  isOpen: boolean;
  onClose: () => void;
  digits: string[];
  isLoading: boolean;
  onDigitChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
}) => (
  <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-sm space-y-4 shadow-xl">
      <Dialog.Title className="text-xl font-bold text-center">Enter Join Code</Dialog.Title>
      <p className="text-sm text-gray-500 text-center">Enter the 6-digit team code</p>

      <div className="flex justify-center space-x-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            ref={(el) => { inputRefs.current[index] = el; }}
            onChange={(e) => onDigitChange(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            className="w-10 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="px-3 py-1 rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Joining..." : "Join"}
        </button>
      </div>
    </Dialog.Panel>
  </Dialog>
);

export default JoinTeamWidget;
