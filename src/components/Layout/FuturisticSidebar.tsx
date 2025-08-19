import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BarChart3, Target, Users, Megaphone, CheckSquare, MapPin, Bell, FileText,
  Zap, Activity, Factory, Shield, Settings, GitBranch, Brain, Sparkles,
  TrendingUp, Globe, Cpu, Database, Network, Eye, ChevronRight, Layers
} from 'lucide-react';

interface SidebarProps {
  activePortal: 'partner' | 'admin';
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const partnerSections = [
  { 
    id: 'home', 
    label: 'AI Command Center', 
    icon: Home, 
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Your intelligent workspace'
  },
  { 
    id: 'dashboard', 
    label: 'Neural Dashboard', 
    icon: Brain, 
    gradient: 'from-purple-500 to-pink-500',
    description: 'AI-powered insights'
  },
  { 
    id: 'opportunities', 
    label: 'Smart Opportunities', 
    icon: Target, 
    gradient: 'from-green-500 to-emerald-500',
    description: 'Predictive deal management'
  },
  { 
    id: 'customers', 
    label: 'Customer Intelligence', 
    icon: Users, 
    gradient: 'from-orange-500 to-red-500',
    description: '360° customer insights'
  },
  { 
    id: 'campaigns', 
    label: 'Campaign Orchestrator', 
    icon: Megaphone, 
    gradient: 'from-indigo-500 to-purple-500',
    description: 'AI-driven campaigns'
  },
  { 
    id: 'activities', 
    label: 'Activity Matrix', 
    icon: CheckSquare, 
    gradient: 'from-teal-500 to-cyan-500',
    description: 'Smart task automation'
  },
  { 
    id: 'trip-planner', 
    label: 'Route Optimizer', 
    icon: MapPin, 
    gradient: 'from-yellow-500 to-orange-500',
    description: 'AI route planning'
  },
  { 
    id: 'reports', 
    label: 'Analytics Engine', 
    icon: BarChart3, 
    gradient: 'from-violet-500 to-purple-500',
    description: 'Advanced reporting'
  },
  { 
    id: 'ai-insights', 
    label: 'AI Insights Hub', 
    icon: Sparkles, 
    gradient: 'from-pink-500 to-rose-500',
    description: 'Machine learning insights'
  }
];

const adminSections = [
  { 
    id: 'overview', 
    label: 'System Overview', 
    icon: Eye, 
    gradient: 'from-blue-500 to-indigo-500',
    description: 'Platform monitoring'
  },
  { 
    id: 'integrations', 
    label: 'Integration Hub', 
    icon: Zap, 
    gradient: 'from-yellow-500 to-orange-500',
    description: 'API connections'
  },
  { 
    id: 'sync-activity', 
    label: 'Sync Intelligence', 
    icon: Activity, 
    gradient: 'from-green-500 to-teal-500',
    description: 'Real-time sync monitoring'
  },
  { 
    id: 'manufacturers', 
    label: 'Manufacturer Network', 
    icon: Factory, 
    gradient: 'from-purple-500 to-violet-500',
    description: 'Partner ecosystem'
  },
  { 
    id: 'partners-rbac', 
    label: 'Access Control', 
    icon: Shield, 
    gradient: 'from-red-500 to-pink-500',
    description: 'Security & permissions'
  },
  { 
    id: 'field-mapping', 
    label: 'AI Field Mapping', 
    icon: GitBranch, 
    gradient: 'from-cyan-500 to-blue-500',
    description: 'Smart data mapping'
  },
  { 
    id: 'analytics', 
    label: 'System Analytics', 
    icon: TrendingUp, 
    gradient: 'from-emerald-500 to-green-500',
    description: 'Platform insights'
  },
  { 
    id: 'ai-engine', 
    label: 'AI Engine Control', 
    icon: Cpu, 
    gradient: 'from-violet-500 to-purple-500',
    description: 'ML model management'
  },
  { 
    id: 'settings', 
    label: 'System Settings', 
    icon: Settings, 
    gradient: 'from-gray-500 to-slate-500',
    description: 'Platform configuration'
  }
];

export default function FuturisticSidebar({ activePortal, activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sections = activePortal === 'partner' ? partnerSections : adminSections;

  return (
    <motion.div 
      className={`${isCollapsed ? 'w-20' : 'w-80'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 h-full flex flex-col relative overflow-hidden transition-all duration-300`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      {/* Header */}
      <div className="p-6 relative z-10">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                SynkCRM AI
              </h1>
              <p className="text-xs text-slate-400 capitalize">
                {activePortal} Intelligence
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* AI Status Indicator */}
      {!isCollapsed && (
        <motion.div 
          className="mx-6 mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-medium text-green-400">AI Engine Active</p>
              <p className="text-xs text-slate-400">Processing 2.4M data points</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 relative z-10">
        <div className="space-y-2">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <motion.button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-lg'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient Background for Active */}
                {isActive && (
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-10`}
                    layoutId="activeBackground"
                  />
                )}
                
                <div className="relative p-4 flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${section.gradient} ${isActive ? 'shadow-lg' : 'opacity-70 group-hover:opacity-100'} transition-all`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <p className={`font-medium transition-colors ${
                        isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}>
                        {section.label}
                      </p>
                      <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                        {section.description}
                      </p>
                    </div>
                  )}
                  
                  {!isCollapsed && isActive && (
                    <ChevronRight className="h-4 w-4 text-white/60" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 relative z-10">
        {!isCollapsed && (
          <motion.div 
            className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Layers className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">System Status</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">AI Processing</span>
                <span className="text-green-400">98.7%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full" style={{ width: '98.7%' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-4 w-full p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-600/30"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="h-4 w-4 text-slate-400 mx-auto" />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
}