import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!agree) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    // Simulate API call
    console.log({ username, email, password });

    onSignup && onSignup(); // Call parent callback (optional)
    navigate("/login"); // Redirect to login after signup
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold">Create an Account</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 font-extrabold">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              placeholder="Username"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-extrabold">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              placeholder="Email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-extrabold">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              placeholder="**********"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 font-extrabold">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              placeholder="**********"
              required
            />
          </div>

          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mr-2"
              />
              <span className="font-extrabold">
                I agree to the terms and conditions
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 text-lg text-white font-extrabold bg-indigo-800 hover:bg-indigo-900 border-3 border-indigo-900 shadow rounded transition duration-200"
          >
            Sign Up
          </button>

          <p className="text-center font-extrabold mt-4">
            Already have an account?{' '}
            <a className="text-red-500 hover:underline" href="/login">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
