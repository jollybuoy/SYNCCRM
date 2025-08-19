import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Bell, ChevronDown, LogOut, User, Settings, 
  Zap, Brain, Globe, Shield, Command, Sparkles, Eye, Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { notifications } from '../../data/sampleData';

interface TopBarProps {
  onNewOpportunity?: () => void;
}

export default function FuturisticTopBar({ onNewOpportunity }: TopBarProps) {
  const { user, logout, portal } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 px-6 py-4 relative overflow-hidden"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex items-center justify-between relative z-10">
        {/* AI-Powered Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center space-x-2">
                <Brain className="h-4 w-4 text-blue-400" />
                <div className="w-px h-4 bg-slate-600"></div>
              </div>
              <input
                type="text"
                placeholder="Ask AI anything... leads, forecasts, insights"
                className="w-full pl-12 pr-16 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all backdrop-blur-sm"
              />
              <div className="absolute right-4 flex items-center space-x-2">
                <kbd className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded border border-slate-600">⌘K</kbd>
                <button className="p-1 text-slate-400 hover:text-blue-400 transition-colors">
                  <Command className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Portal Badge */}
          <motion.div 
            className={`px-4 py-2 rounded-xl text-sm font-medium border backdrop-blur-sm ${
              portal === 'admin' 
                ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30' 
                : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-2">
              {portal === 'admin' ? <Shield className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              <span>{portal === 'admin' ? 'Admin Intelligence' : 'Partner Intelligence'}</span>
            </div>
          </motion.div>

          {/* AI Assistant */}
          <motion.button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="relative p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
          </motion.button>

          {/* Quick Actions */}
          {portal === 'partner' && (
            <motion.button
              onClick={onNewOpportunity}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="mr-2 h-4 w-4" />
              AI Opportunity
            </motion.button>
          )}

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-all backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute right-0 mt-2 w-96 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-600/50 z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">AI Notifications</h3>
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Smart Filtered</span>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        className={`p-4 border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors ${
                          !notification.read ? 'bg-blue-500/5' : ''
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            notification.type === 'opportunity' ? 'bg-green-500/20 text-green-400' :
                            notification.type === 'sync_error' ? 'bg-red-500/20 text-red-400' :
                            notification.type === 'campaign' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            <Brain className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-4 text-center border-t border-slate-700/50">
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      View All AI Insights
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors backdrop-blur-sm border border-slate-600/30"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={user?.firstName}
                  className="h-10 w-10 rounded-xl border-2 border-slate-600/50"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></div>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-slate-400 capitalize">
                  {user?.role} • AI Enhanced
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-600/50 z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors">
                      <User className="mr-3 h-4 w-4" />
                      Profile Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors">
                      <Settings className="mr-3 h-4 w-4" />
                      AI Preferences
                    </button>
                    <button className="flex items-center w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors">
                      <Zap className="mr-3 h-4 w-4" />
                      Integrations
                    </button>
                    <div className="border-t border-slate-700/50 my-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-lg"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out Securely
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}