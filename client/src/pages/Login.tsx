import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(`Login failed: ${err}`);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h2 className="text-white text-2xl font-bold mb-6">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-700 text-white p-3 rounded mb-4 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-700 text-white p-3 rounded mb-4 outline-none"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded mb-3"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate("/register")}
          className="w-full text-gray-400 hover:text-white text-sm"
        >
          No account? Register
        </button>
      </div>
    </div>
  );
};

export default Login;
