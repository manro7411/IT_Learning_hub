import { useContext, useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { AuthContext } from "../Authentication/AuthContext";
import axios from "axios";

interface Team {
  id: string;
  name: string;
  description: string;
  joinCode: string;
}
import { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";

const JoinTeamWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [joinedTeams, setJoinedTeams] = useState<Team[]>([]);

  const { token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetForm = () => {
    setDigits(["", "", "", "", "", ""]);
    setErrorMessage("");
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Array of refs

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
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          const id = res.data.id;
          const name = res.data.name;
          setUserId(id);
          setUserName(name);

          const teamRes = await axios.get(`http://localhost:8080/teams/my-teams/${id}`);
          setJoinedTeams(teamRes.data || []);
        }
      } catch (error) {
        console.error("Error fetching user or team data:", error);
      }
    };

    fetchUserData();
    if (isOpen) {
      inputRefs.current[0]?.focus();
    }
  }, [token, isOpen]);

  const handleSubmit = async () => {
    const joinCode = digits.join("");
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("http://localhost:8080/teams/joining", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          joinCode,
          userId,
          userName,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "You have already joined this team!");
      }

      setSuccessMessage("✅ Joined team successfully!");
      resetForm();
      setIsOpen(false);

      // Refetch joined teams
      const updated = await axios.get(`http://localhost:8080/teams/my-teams/${userId}`);
      setJoinedTeams(updated.data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
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
        {joinedTeams.length > 0 ? (
          <>
           
            {joinedTeams.map((team) => (
               <h2  key={team.id} className="text-lg font-semibold mb-2">Team Joined : {team.name}</h2>
            )
            )}
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4">Join a Team</h2>
            <p className="text-gray-600 mb-4">Join a team to collaborate on projects and assignments.</p>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Join Team
            </button>
          </>
        )}

        {successMessage && <p className="mt-2 text-green-600">{successMessage}</p>}
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
                inputMode="numeric"
                maxLength={1}
                value={digit}
                ref={(el) => { inputRefs.current[index] = el; }}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                className="w-10 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          {errorMessage && <p className="text-sm text-red-500 text-center">{errorMessage}</p>}

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
              disabled={loading}

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={digits.some((d) => d === "") || loading}
              className="px-4 py-2 rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Joining..." : "Join"}
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
