import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "@/App.css";
import { Toaster } from "sonner";
import { toast } from "sonner";

// Import components
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

// Configure axios to include credentials for sessions
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/check-auth`);
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post(`${API}/login`, credentials);
      setUser(response.data.user);
      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await axios.post(`${API}/register`, userData);
      setUser(response.data.user);
      toast.success("Registration successful!");
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/logout`);
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null); // Clear user anyway
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      <BrowserRouter>
        <Header user={user} onLogout={handleLogout} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route
              path="/profile"
              element={
                user ? (
                  <ProfilePage user={user} setUser={setUser} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/auth"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
                )
              }
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;