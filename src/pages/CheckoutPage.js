import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://clothsonlin321.pythonanywhere.com';
const API = `${BACKEND_URL}/api`;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Get checkout data from location state
  const checkoutData = location.state;
  
  const [formData, setFormData] = useState({
    customer_info: {
      name: "",
      email: "",
      phone: ""
    },
    shipping_address: {
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "India"
    }
  });

  useEffect(() => {
    // Redirect if no checkout data
    if (!checkoutData || !checkoutData.product) {
      navigate("/products");
      return;
    }
  }, [checkoutData, navigate]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const { customer_info, shipping_address } = formData;
    
    if (!customer_info.name || !customer_info.email || !customer_info.phone) {
      toast.error("Please fill all customer information fields");
      return false;
    }
    
    if (!shipping_address.street || !shipping_address.city || !shipping_address.state || !shipping_address.zip_code) {
      toast.error("Please fill all shipping address fields");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_info.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    // Basic phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(customer_info.phone.replace(/\D/g, ''))) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const orderData = {
        product_id: checkoutData.product.id,
        quantity: checkoutData.quantity,
        size: checkoutData.size,
        customer_info: formData.customer_info,
        shipping_address: formData.shipping_address
      };
      
      const response = await axios.post(`${API}/orders`, orderData);
      
      toast.success("Order placed successfully!");
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${response.data.order.id}`, {
        state: { order: response.data.order }
      });
      
    } catch (error) {
      console.error("Order placement failed:", error);
      const errorMessage = error.response?.data?.error || "Failed to place order";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData || !checkoutData.product) {
    return null;
  }

  const { product, quantity, size } = checkoutData;
  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              data-testid="checkout-back-button"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold">Customer Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customer_info.name}
                      onChange={(e) => handleInputChange('customer_info', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Enter your full name"
                      data-testid="customer-name-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.customer_info.email}
                      onChange={(e) => handleInputChange('customer_info', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Enter your email"
                      data-testid="customer-email-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.customer_info.phone}
                      onChange={(e) => handleInputChange('customer_info', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Enter your phone number"
                      data-testid="customer-phone-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.street}
                      onChange={(e) => handleInputChange('shipping_address', 'street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Enter street address"
                      data-testid="address-street-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.city}
                      onChange={(e) => handleInputChange('shipping_address', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Enter city"
                      data-testid="address-city-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.state}
                      onChange={(e) => handleInputChange('shipping_address', 'state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Enter state"
                      data-testid="address-state-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.zip_code}
                      onChange={(e) => handleInputChange('shipping_address', 'zip_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Enter ZIP code"
                      data-testid="address-zip-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.shipping_address.country}
                      onChange={(e) => handleInputChange('shipping_address', 'country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      data-testid="address-country-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                </div>
                <div className="flex items-center p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Package className="w-5 h-5 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                </div>
                
                <div className="flex items-start space-x-4 mb-4 pb-4 border-b border-gray-200">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        Size: {size}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Qty: {quantity}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unit Price:</span>
                    <span>${product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Estimated delivery: 5-7 business days</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
                  data-testid="place-order-button"
                >
                  {loading ? (
                    <div className="loading-spinner mr-2" />
                  ) : null}
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;