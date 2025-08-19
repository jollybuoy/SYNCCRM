import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, Shield, BarChart3, Users, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [selectedPortal, setSelectedPortal] = useState<'admin' | 'partner'>('partner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password, selectedPortal);
    
    if (success) {
      toast.success(`Welcome to ${selectedPortal === 'admin' ? 'Admin' : 'Partner'} Portal!`);
    } else {
      toast.error('Invalid credentials. Try: admin@synkcrm.com / sarah@reppartner.com with password: password');
    }
  };

  const features = [
    { icon: Zap, title: 'Neural AI Engine', desc: 'Advanced machine learning with 99.7% accuracy' },
    { icon: Shield, title: 'Quantum Security', desc: 'Military-grade encryption and zero-trust architecture' },
    { icon: BarChart3, title: 'Predictive Analytics', desc: 'Future-ready insights with real-time processing' },
    { icon: Users, title: 'Unified Intelligence', desc: 'Multi-manufacturer ecosystem in one platform' },
    { icon: Globe, title: 'Global Neural Network', desc: 'Worldwide synchronization with edge computing' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">SynkCRM</h1>
                <p className="text-blue-200">AI-Powered Multi-Manufacturer CRM</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              The Future of<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered CRM
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Experience the next generation of CRM with neural AI, predictive analytics, 
              and quantum-level security that transforms how you manage relationships.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                    <p className="text-blue-200 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-blue-200">Access your AI-powered workspace</p>
            </div>

            {/* Portal Selector */}
            <div className="mb-6">
              <div className="bg-white/5 rounded-xl p-1 flex">
                <button
                  type="button"
                  onClick={() => setSelectedPortal('partner')}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                    selectedPortal === 'partner'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  Partner Intelligence
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPortal('admin')}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                    selectedPortal === 'admin'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  System Control
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                  selectedPortal === 'admin'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Access {selectedPortal === 'admin' ? 'System Control' : 'Partner Intelligence'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Demo Access
              </h4>
              <div className="space-y-2 text-xs text-blue-200">
                <div>
                  <strong>Partner Intelligence:</strong> sarah@reppartner.com
                </div>
                <div>
                  <strong>System Control:</strong> admin@synkcrm.com
                </div>
                <div>
                  <strong>Password:</strong> password
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}