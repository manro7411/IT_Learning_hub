import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
    const nav = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) =>
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("http://localhost:8080/register", form);
            alert("✅ Registration success, please login");
            nav("/");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                alert(err.response?.data?.error ?? "Register failed");
            } else {
                alert("Unexpected error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-5"
            >
                <h1 className="text-2xl font-bold text-center">Create account</h1>

                <input
                    name="name"
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange}
                    className="border w-full px-4 py-2 rounded-lg"
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="border w-full px-4 py-2 rounded-lg"
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="border w-full px-4 py-2 rounded-lg"
                    required
                />
                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="border w-full px-4 py-2 rounded-lg"
                    required
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="supervisor">Supervisor</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    {loading ? "Registering…" : "Register"}
                </button>

                <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
