type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Props = {
  users: User[];
  assignRole: (userId: string, role: string) => void;
  error: string | null;
};

export default function UserListWidget({ users, assignRole, error }: Props) {
  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      {users.map((user) => {
        const isAdmin = user.role.toLowerCase() === "admin";

        return (
          <div
            key={user.id}
            className="flex justify-between items-center p-4 border rounded-lg"
          >
            <div>
              <p className="font-semibold">{user.name || user.email}</p>
              <p className="text-sm text-gray-500">Role: {user.role || "Unknown"}</p>
            </div>

            {isAdmin ? (
              <span className="text-green-600 font-medium">Already Admin</span>
            ) : (
              <button
                onClick={() => assignRole(user.id, "admin")}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Assign Admin
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
