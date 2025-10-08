import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  LogOut, 
  UserCircle,
  Home,
  Package
} from "lucide-react";

const Header = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-bold text-xl text-gray-900 hover:text-orange-600 transition-colors"
            data-testid="logo-link"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block">StyleSphere</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/")
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
              data-testid="home-nav-link"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("/products")
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
              data-testid="products-nav-link"
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive("/profile")
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                  data-testid="profile-nav-link"
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="text-sm">{user.username}</span>
                </Link>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-red-600 hover:border-red-300"
                  data-testid="logout-button"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" data-testid="login-button">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors"
            data-testid="mobile-menu-button"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                }`}
                data-testid="mobile-home-link"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive("/products")
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                }`}
                data-testid="mobile-products-link"
              >
                <Package className="w-4 h-4" />
                <span>Products</span>
              </Link>
              
              <div className="border-t border-gray-200 my-2"></div>
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive("/profile")
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    }`}
                    data-testid="mobile-profile-link"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span>{user.username}</span>
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-3 rounded-lg font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 text-left w-full"
                    data-testid="mobile-logout-button"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-3 rounded-lg font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-all duration-200"
                  data-testid="mobile-auth-link"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;