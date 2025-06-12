import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Hardcoded credentials for demonstration
  const allowedEmail = "admin@gmail.com";
  const allowedPassword = "admin123";

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check email and password against allowed credentials
    if (email === allowedEmail && password === allowedPassword) {
      setError("");
      onLogin && onLogin();
      navigate("/");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold">Sign in</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-extrabold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              type="email"
              placeholder="email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-extrabold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              type="password"
              placeholder="password"
              required
            />
          </div>
          <div className="flex flex-wrap -mx-4 mb-6 items-center justify-between">
            <div className="w-full lg:w-auto px-4 mb-4 lg:mb-0">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-1 font-extrabold">Remember me</span>
              </label>
            </div>
            <div className="w-full lg:w-auto px-4">
              <a
                className="inline-block font-extrabold hover:underline"
                href="#"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="inline-block w-full py-4 px-6 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-indigo-800 hover:bg-indigo-900 border-3 border-indigo-900 shadow rounded transition duration-200"
          >
            Sign in
          </button>
          <p className="text-center font-extrabold">
            Don't have an account?{" "}
            <Link to="/signup" className="text-red-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
