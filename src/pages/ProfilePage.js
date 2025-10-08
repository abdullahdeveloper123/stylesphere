import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Edit3, 
  Save, 
  X, 
  ShoppingBag, 
  Package, 
  Clock,
  CheckCircle
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const ProfilePage = ({ user, setUser }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    username: user?.username || ""
  });

  // Orders loaded from backend for authenticated user
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    // Fetch orders when component mounts or when user changes
    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);
        setOrdersError(null);
        const response = await axios.get(`${API}/orders`);
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setOrdersError(err.response?.data?.error || err.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      const response = await axios.put(`${API}/profile`, profileData);
      
      if (response.data.user) {
        setUser(response.data.user);
        setEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      full_name: user?.full_name || "",
      email: user?.email || "",
      username: user?.username || ""
    });
    setEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Package className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {user?.full_name || user?.username || "User"}
              </h1>
              <p className="text-gray-300 text-lg">{user?.email}</p>
              <p className="text-gray-400 text-sm">
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile" data-testid="profile-tab">Profile Settings</TabsTrigger>
            <TabsTrigger value="orders" data-testid="orders-tab">Order History</TabsTrigger>
          </TabsList>

          {/* Profile Settings Tab */}
          <TabsContent value="profile">
            <Card className="shadow-sm">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
                  {!editing ? (
                    <Button
                      onClick={() => setEditing(true)}
                      variant="outline"
                      className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      data-testid="edit-profile-button"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-orange-500 hover:bg-orange-600"
                        data-testid="save-profile-button"
                      >
                        {loading ? (
                          <div className="loading-spinner mr-2" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        data-testid="cancel-edit-button"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="username"
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        disabled={!editing}
                        className="pl-10"
                        data-testid="profile-username-input"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!editing}
                        className="pl-10"
                        data-testid="profile-email-input"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="full_name"
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        disabled={!editing}
                        placeholder="Enter your full name"
                        className="pl-10"
                        data-testid="profile-fullname-input"
                      />
                    </div>
                  </div>
                </div>

                {!editing && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Account Details</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Account ID: {user?.id?.substring(0, 8) || 'N/A'}</p>
                      <p>Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}</p>
                      <p>Account status: Active</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>
                
                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="loading-spinner" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading orders...</h3>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Browse Products
                    </Button>
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-12">
                    <p className="text-red-600">{ordersError}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <Card key={order.id} className="border border-gray-200" data-testid={`order-${order.id}`}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">
                                Order #{order.id}
                              </h3>
                              <p className="text-gray-600">Placed on {new Date(order.created_at || order.date || Date.now()).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.order_status || order.status)}`}>
                                {getStatusIcon(order.order_status || order.status)}
                                {order.order_status || order.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {(order.items || []).map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-gray-600 ml-2">× {item.quantity}</span>
                                </div>
                                <span className="font-medium">${item.price}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <span className="font-semibold text-lg">Total</span>
                            <span className="font-bold text-xl text-orange-600">${order.total_price || order.total}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;