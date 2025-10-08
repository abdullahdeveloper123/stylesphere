import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">StyleSphere</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for trendy fashion. From men's and women's wear to children's clothing and underwear - we've got style for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-orange-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=men" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Men's Wear
                </Link>
              </li>
              <li>
                <Link to="/products?category=women" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Women's Wear
                </Link>
              </li>
              <li>
                <Link to="/products?category=kids" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Kids' Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Casual Wear</li>
              <li>Formal Attire</li>
              <li>Sportswear</li>
              <li>Accessories</li>
              <li>Seasonal Collections</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>123 Fashion Street, Style City, SC 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@stylesphere.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              Made By Abdullah Hussain.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Connect Now:</span>
              <div className="bg-gray-800 px-3 py-1 rounded text-xs text-gray-300 font-medium">
                <a href="https://www.linkedin.com/in/abdullah-hussain-b76801387/" className="mx-3">Linkedin</a>
                <a href="https://github.com/abdullahdeveloper123">Github</a>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;