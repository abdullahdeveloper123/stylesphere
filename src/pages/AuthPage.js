import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  LogIn,
  Eye,
  EyeOff
} from "lucide-react";

const AuthPage = ({ onLogin, onRegister }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: ""
  });

  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
    confirm: false
  });

  const [loading, setLoading] = useState({
    login: false,
    register: false
  });

  const [errors, setErrors] = useState({});

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, login: true });
    setErrors({});

    // Validate
    const newErrors = {};
    if (!loginData.email) newErrors.email = "Email is required";
    if (!loginData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading({ ...loading, login: false });
      return;
    }

    const result = await onLogin(loginData);
    
    if (!result.success) {
      setErrors({ general: result.error });
    }
    
    setLoading({ ...loading, login: false });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, register: true });
    setErrors({});

    // Validate
    const newErrors = {};
    if (!registerData.username) newErrors.username = "Username is required";
    if (!registerData.email) newErrors.email = "Email is required";
    if (!registerData.password) newErrors.password = "Password is required";
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    if (registerData.password && registerData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading({ ...loading, register: false });
      return;
    }

    const result = await onRegister({
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      full_name: registerData.full_name
    });
    
    if (!result.success) {
      setErrors({ general: result.error });
    }
    
    setLoading({ ...loading, register: false });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to StyleSphere</h2>
          <p className="text-gray-600">Sign in to your account or create a new one</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" data-testid="login-tab">Sign In</TabsTrigger>
                <TabsTrigger value="register" data-testid="register-tab">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" data-testid="login-error">
                      {errors.general}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        data-testid="login-email-input"
                      />
                    </div>
                    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-password"
                        type={showPassword.login ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        data-testid="login-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('login')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        data-testid="login-password-toggle"
                      >
                        {showPassword.login ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={loading.login}
                    data-testid="login-submit-button"
                  >
                    {loading.login ? (
                      <div className="loading-spinner mr-2" />
                    ) : (
                      <LogIn className="w-4 h-4 mr-2" />
                    )}
                    {loading.login ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" data-testid="register-error">
                      {errors.general}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                        className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                        data-testid="register-username-input"
                      />
                    </div>
                    {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-full-name">Full Name (Optional)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-full-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerData.full_name}
                        onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                        className="pl-10"
                        data-testid="register-fullname-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        data-testid="register-email-input"
                      />
                    </div>
                    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-password"
                        type={showPassword.register ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        data-testid="register-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('register')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        data-testid="register-password-toggle"
                      >
                        {showPassword.register ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirm-password"
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        data-testid="register-confirm-password-input"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        data-testid="register-confirm-password-toggle"
                      >
                        {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={loading.register}
                    data-testid="register-submit-button"
                  >
                    {loading.register ? (
                      <div className="loading-spinner mr-2" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    {loading.register ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default AuthPage;