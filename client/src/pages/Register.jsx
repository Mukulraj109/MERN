import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Manager",
    department: "",
  });

  const { username, email, password, role, department } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Registering with:", formData);
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          value={username}
          onChange={onChange}
          placeholder="Username"
          required
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          required
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          required
          className="w-full p-2 border rounded mb-2"
        />

        {/* Department Dropdown */}
        <select
          name="department"
          value={department}
          onChange={onChange}
          required
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select Department</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
        </select>

        {/* Role Dropdown */}
        <select name="role" value={role} onChange={onChange} className="w-full p-2 border rounded mb-2">
          <option value="Manager">Manager</option>
          <option value="Operator">Operator</option>
        </select>

        <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {/* Display Errors */}
      {/* Display Errors */}
{error && (
  <div className="text-red-500 mt-2">
    {typeof error === "string" ? (
      <p>{error}</p>
    ) : error.msg ? (
      <p>{error.msg}</p>
    ) : Array.isArray(error.errors) ? (
      error.errors.map((err, index) => <p key={index}>{err.msg}</p>)
    ) : (
      <p>Something went wrong</p>
    )}
  </div>
)}

    </div>
  );
};

export default Register;
