import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  ShoppingBag, 
  Star, 
  ArrowLeft,
  Plus,
  Minus,
  Truck,
  Shield,
  RefreshCw,
  Heart
} from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://clothsonlin321.pythonanywhere.com';
const API = `${BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock sizes for demonstration
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    // Simulate add to cart (since we don't have cart functionality yet)
    setTimeout(() => {
      toast.success(`${quantity} item(s) added to cart!`);
      setIsAddingToCart(false);
    }, 1000);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleBuyNow = () => {
    // Navigate to checkout with product details
    navigate('/checkout', {
      state: {
        product: product,
        quantity: quantity,
        size: selectedSize
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.category_name}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-2xl overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover"
                data-testid="product-image"
              />
            </div>
            
            {/* Thumbnail Gallery (Mock) */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
                >
                  <img
                    src={product.image_url}
                    alt={`${product.name} view ${index}`}
                    className="w-full h-20 object-cover opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {product.category_name}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="product-name">
                    {product.name}
                  </h1>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400 hover:text-red-600"
                  }`}
                  data-testid="favorite-button"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">(128 reviews)</span>
                </div>
                <span className="text-sm text-gray-600">
                  SKU: {product.id.substring(0, 8).toUpperCase()}
                </span>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-orange-600" data-testid="product-price">
                  ${product.price}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${(product.price * 1.3).toFixed(2)}
                </span>
                <Badge variant="destructive">
                  23% OFF
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Free shipping on orders over $50
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 border rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                    data-testid={`size-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="quantity-decrease"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium" data-testid="quantity-display">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="quantity-increase"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900 block mb-2">
                    Stock Available
                  </span>
                  <span className="text-sm text-gray-600">
                    {product.stock} units
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
                  data-testid="add-to-cart-button"
                >
                  {isAddingToCart ? (
                    <div className="loading-spinner mr-2" />
                  ) : (
                    <ShoppingBag className="w-5 h-5 mr-2" />
                  )}
                  {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 py-3 text-lg font-semibold"
                  data-testid="buy-now-button"
                  onClick={handleBuyNow}
                >
                  Buy Now - Cash on Delivery
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Free Delivery</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Quality Guaranteed</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <RefreshCw className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">7-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description} This premium quality item is crafted with attention to detail and designed 
                    for both comfort and style. Perfect for any occasion, it combines modern trends with timeless appeal.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><span className="font-medium">Material:</span> 100% Premium Cotton</li>
                    <li><span className="font-medium">Care:</span> Machine washable</li>
                    <li><span className="font-medium">Origin:</span> Designed with care</li>
                    <li><span className="font-medium">Fit:</span> Regular fit</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;