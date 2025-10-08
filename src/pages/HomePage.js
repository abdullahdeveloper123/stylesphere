import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { 
  ArrowRight, 
  Star, 
  ShoppingBag, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronRight
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.get(`${API}/categories`),
        axios.get(`${API}/products`)
      ]);
      
      setCategories(categoriesRes.data.categories);
      // Get first 3 products as featured
      setFeaturedProducts(productsRes.data.products.slice(0, 3));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1923109/pexels-photo-1923109.jpeg" 
            alt="Fashion Models" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 fade-in-up">
              Discover Your 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                Perfect Style
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed slide-in-right">
              From trendy men's wear to elegant women's fashion, adorable children's clothing to premium underwear - StyleSphere brings you the latest in fashion for every member of your family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold"
                  data-testid="shop-now-button"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold"
                data-testid="explore-collections-button"
              >
                Explore Collections
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="feature-shipping">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cash on Delivery</h3>
              <p className="text-gray-600">Pay when you receive your order. No advance payment required.</p>
            </div>
            <div className="text-center" data-testid="feature-quality">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Premium quality clothing with satisfaction guarantee.</p>
            </div>
            <div className="text-center" data-testid="feature-exchange">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Exchange</h3>
              <p className="text-gray-600">Hassle-free exchanges within 7 days of delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collections designed for every style and occasion
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="category-card group"
                data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="relative h-64 overflow-hidden rounded-xl">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-xl font-bold mb-2">{category.name}</h3>
                    <div className="flex items-center text-white/90 text-sm group-hover:text-orange-300 transition-colors">
                      <span>Shop Collection</span>
                      <ChevronRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked favorites from our latest collection
              </p>
            </div>
            <Link 
              to="/products"
              className="hidden sm:flex items-center text-orange-600 hover:text-orange-700 font-semibold"
              data-testid="view-all-products-link"
            >
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="product-card cursor-pointer hover:shadow-lg transition-shadow" data-testid={`featured-product-${product.id}`}>
                <Link to={`/products/${product.id}`} className="block">
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center ml-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-500 ml-1">4.5</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="price-tag text-2xl">
                        ${product.price}
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        data-testid={`add-to-cart-${product.id}`}
                        onClick={(e) => e.preventDefault()} // Prevent card navigation when clicking button
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/products">
              <Button 
                variant="outline" 
                className="border-orange-500 text-orange-600 hover:bg-orange-50"
                data-testid="mobile-view-all-products"
              >
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Stay in Style
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Subscribe to get updates on new arrivals, exclusive offers, and style tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              data-testid="newsletter-email-input"
            />
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              data-testid="newsletter-subscribe-button"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;