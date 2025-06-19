// src/pages/Settings/AccountSettingsPage.tsx
import { useState } from "react";
import SidebarWidget from "../../widgets/SidebarWidget";

const AccountSettingsPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleReset = () =>
    setForm({ fullName: "", username: "", email: "", phone: "", bio: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ───────────── Sidebar ───────────── */}
      <SidebarWidget />

      {/* ───────────── Main Setting Panel ───────────── */}
      <main className="flex-1 p-8">
        {/* Tabs */}
        <div className="flex space-x-8 border-b text-sm font-medium text-gray-500 mb-8">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-2">
            Account Setting
          </button>
          <button className="hover:text-blue-600">Login & Security</button>
          <button className="hover:text-blue-600">Notifications</button>
          <button className="hover:text-blue-600">Interface</button>
          <button className="hover:text-blue-600">Interface</button>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-8 space-y-8"
        >
          {/* Upload profile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Profile Picture
            </label>
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-400 cursor-pointer hover:bg-gray-50">
              Upload your photo
            </div>
          </div>

          {/* Grid inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Please enter your full name"
                className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Please enter your email"
                className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Please enter your username"
                className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Phone */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+66 Please enter your phone number"
                className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg"
              />
            </div> */}
          </div>

          {/* Bio */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Write your Bio here e.g your hobbies, interests ETC"
              className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg"
            />
          </div> */}

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 text-gray-600 hover:underline"
            >
              Reset
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AccountSettingsPage;
