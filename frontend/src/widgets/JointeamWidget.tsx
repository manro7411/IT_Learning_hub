import { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";

const JoinTeamWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Array of refs

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Move to next input if not last and value entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const joinCode = digits.join("");
    console.log("🔑 Join code submitted:", joinCode);
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setDigits(["", "", "", "", "", ""]);
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Join a Team</h2>
        <p className="text-gray-600 mb-4">Join a team to collaborate on projects and assignments.</p>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Join Team
        </button>
      </div>

      <Dialog open={isOpen} onClose={handleClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
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
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1 rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600"
            >
              Join
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default JoinTeamWidget;
