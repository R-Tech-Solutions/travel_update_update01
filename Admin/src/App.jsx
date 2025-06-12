import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AddPlace from "./pages/AddPlace";
import Login from "./pages/Login";
import Signup from "./pages/SighnUp"; // ✅ Corrected import
import Orders  from "./pages/Orders";
import UserAccess from "./pages/UserAccess";
import { useState } from "react";
import Gellery from "./pages/Gellery";
import Posts from "./pages/Posts";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
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
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
