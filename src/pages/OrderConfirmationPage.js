import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  CheckCircle,
  Package,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  Home,
  ShoppingBag
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
      navigate("/products");
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

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Order ID: {order.id.substring(0, 8).toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Order Details */}
          <div className="space-y-6">
            
            {/* Product Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Package className="w-5 h-5 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold">Order Details</h2>
                </div>
                
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={order.product_image}
                    alt={order.product_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{order.product_name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium">{order.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium">{order.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Price:</span>
                        <span className="font-medium">${order.unit_price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-orange-600">${order.total_price.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold">Order Status</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Order Status:</span>
                    <Badge className="bg-green-100 text-green-800">
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <Badge variant="secondary">
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{order.payment_method}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span className="font-medium">{order.estimated_delivery}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer & Shipping Information */}
          <div className="space-y-6">
            
            {/* Customer Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold">Customer Information</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-3" />
                    <span>{order.customer_info.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <span>{order.customer_info.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <span>{order.customer_info.phone}</span>
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
                
                <div className="flex items-start">
                  <Home className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                  <div className="text-gray-700">
                    <div>{order.shipping_address.street}</div>
                    <div>
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}
                    </div>
                    <div>{order.shipping_address.country}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3 text-blue-900">What's Next?</h2>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>You will receive an order confirmation email shortly</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>We'll send you tracking information once your order ships</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Your order will be delivered within {order.estimated_delivery}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Payment will be collected upon delivery</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto border-orange-500 text-orange-600 hover:bg-orange-50"
              data-testid="continue-shopping-button"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Link to="/">
            <Button 
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white"
              data-testid="back-to-home-button"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;