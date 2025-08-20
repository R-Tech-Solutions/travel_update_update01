import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AddPlace from "./pages/AddPlace";
import Login from "./pages/Login";
import Signup from "./pages/SighnUp"; // ✅ Corrected import
import Orders  from "./pages/Orders";
import UserAccess from "./pages/UserAccess";
import { useState, useEffect } from "react";
import Gellery from "./pages/Gellery";
import Posts from "./pages/Posts";
import Settings from "./pages/Setting";
import Front from "./pages/Front";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("login") === "true");

  // Sync isAuthenticated with sessionStorage changes (optional, for robustness)
  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(sessionStorage.getItem("login") === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("login", "true");
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.setItem("login", "false");
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} /> ✅ Signup Route

        Protected routes
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="AddPlace" element={<AddPlace />} />
          <Route path="Orders" element={<Orders />} />
          <Route path="UserAccess" element={<UserAccess />} />
          <Route path="Gellery" element={<Gellery />} />
          <Route path="Posts" element={<Posts />} />
          <Route path="Settings" element={<Settings/>}/>
          <Route path="Front" element={<Front/>}/>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
