// SYNCCRM/src/components/PartnerPortal/FuturisticHome.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Zap, TrendingUp, Target, Users, Globe, Sparkles, 
  Activity, CheckCircle, AlertTriangle, Clock, DollarSign,
  ArrowUpRight, BarChart3, Eye, Cpu, Network, Shield
} from 'lucide-react';
import { currentUser, opportunities, activities, customers, manufacturers, campaigns } from '../../data/sampleData';

const StatCard = ({ title, value, change, icon: Icon, gradient, delay = 0 }: any) => (
  <motion.div
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-2xl`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02, y: -5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <Icon className="h-6 w-6" />
        </div>
        <ArrowUpRight className="h-5 w-5 opacity-60" />
      </div>
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        <p className="text-white/70 text-sm mt-2">{change}</p>
      </div>
    </div>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full"></div>
  </motion.div>
);

const AIInsightCard = ({ title, description, confidence, type, delay = 0 }: any) => (
  <motion.div
    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-xl ${
        type === 'opportunity' ? 'bg-green-500/20 text-green-400' :
        type === 'risk' ? 'bg-red-500/20 text-red-400' :
        type === 'insight' ? 'bg-blue-500/20 text-blue-400' :
        'bg-purple-500/20 text-purple-400'
      }`}>
        <Brain className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-3">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{confidence}% confidence</span>
          </div>
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function FuturisticHome() {
  const openOpportunities = opportunities.filter(opp => !['won', 'lost'].includes(opp.stage)).length;
  const totalForecast = opportunities
    .filter(opp => !['won', 'lost'].includes(opp.stage))
    .reduce((sum, opp) => sum + (opp.amount * (opp.probability || 50) / 100), 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const syncHealthy = manufacturers.filter(m => m.status === 'connected').length;

  const aiInsights = [
    { title: "High-Value Prospect Identified", description: "MIT shows 87% similarity to your top closed deals. Immediate follow-up recommended.", confidence: 92, type: "opportunity" },
    { title: "Deal Velocity Alert", description: "Johns Hopkins opportunity stagnant for 45 days. Risk of loss increasing.", confidence: 78, type: "risk" },
    { title: "Optimal Contact Window", description: "University contacts respond 3x better on Tuesday-Thursday, 10-11 AM.", confidence: 85, type: "insight" },
    { title: "Revenue Forecast Update", description: "Q2 forecast adjusted to $12.4M based on current pipeline velocity.", confidence: 91, type: "prediction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Hero Section */}
      <motion.div
        className="relative z-0 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 mb-8 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back, {currentUser.firstName}! 🚀
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your AI-powered multi-manufacturer command center is ready
            </motion.p>
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/90">AI Engine Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <Network className="h-4 w-4 text-white/80" />
                <span className="text-white/90">{syncHealthy}/{manufacturers.length} Manufacturers Synced</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-white/80" />
                <span className="text-white/90">Processing 2.4M Data Points</span>
              </div>
            </motion.div>
          </div>

          {/* Decorative brain — make it non-interactive */}
          <motion.div
            className="hidden lg:block pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Decorative circles — also non-interactive */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full pointer-events-none"></div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="AI Pipeline Forecast" value={`$${(totalForecast / 1000000).toFixed(1)}M`} change="+18% vs last quarter" icon={TrendingUp} gradient="from-blue-500 to-cyan-500" delay={0.1} />
        <StatCard title="Smart Opportunities" value={openOpportunities} change="12 high-probability deals" icon={Target} gradient="from-green-500 to-emerald-500" delay={0.2} />
        <StatCard title="AI Win Rate" value="73.2%" change="+5.8% improvement" icon={Sparkles} gradient="from-purple-500 to-violet-500" delay={0.3} />
        <StatCard title="Active Campaigns" value={activeCampaigns} change="2.4K contacts engaged" icon={Users} gradient="from-orange-500 to-red-500" delay={0.4} />
      </div>

      {/* AI Insights Section */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Intelligence Hub</h2>
              <p className="text-slate-400">Real-time insights powered by machine learning</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Live Analysis</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {aiInsights.map((insight, index) => (
            <AIInsightCard key={index} {...insight} delay={0.6 + index * 0.1} />
          ))}
        </div>
      </motion.div>

      {/* Manufacturer Status Grid */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        {/* Manufacturer Sync Status */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Manufacturer Intelligence</h3>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm">Real-time Sync</span>
            </div>
          </div>
          <div className="space-y-4">
            {manufacturers.map((manufacturer, index) => (
              <motion.div
                key={manufacturer.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{manufacturer.logo}</div>
                  <div>
                    <p className="font-semibold text-white">{manufacturer.name}</p>
                    <p className="text-sm text-slate-400">{manufacturer.industry}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    manufacturer.status === 'connected' ? 'bg-green-400 animate-pulse' :
                    manufacturer.status === 'syncing' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                  }`} />
                  <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    manufacturer.status === 'connected' ? 'bg-green-500/20 text-green-400' :
                    manufacturer.status === 'syncing' ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {manufacturer.status}
                  </div>
                  {manufacturer.syncFrequency === 'realtime' && (
                    <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      Real-time
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Live Activity Stream</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">Live</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { type: 'ai', message: 'AI identified high-value prospect: Stanford University', time: '2 min ago', icon: Brain, color: 'text-purple-400' },
              { type: 'opportunity', message: 'New opportunity created: MIT Campus Expansion', time: '5 min ago', icon: Target, color: 'text-blue-400' },
              { type: 'sync', message: 'G&W Electric sync completed successfully', time: '8 min ago', icon: CheckCircle, color: 'text-green-400' },
              { type: 'alert', message: 'Johns Hopkins deal requires attention', time: '12 min ago', icon: AlertTriangle, color: 'text-yellow-400' },
              { type: 'insight', message: 'AI recommends focusing on healthcare vertical', time: '15 min ago', icon: Sparkles, color: 'text-pink-400' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
              >
                <div className={`p-2 rounded-lg bg-slate-600/50 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.message}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
        <button className="p-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl text-left hover:from-blue-500/30 hover:to-cyan-500/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-all">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Neural Dashboard</h3>
          <p className="text-slate-400 text-sm">Advanced analytics with AI insights</p>
        </button>

        <button className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl text-left hover:from-green-500/30 hover:to-emerald-500/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-all">
              <Target className="h-6 w-6 text-green-400" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-green-400 opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Smart Opportunities</h3>
          <p className="text-slate-400 text-sm">AI-powered deal management</p>
        </button>

        <button className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl text-left hover:from-purple-500/30 hover:to-pink-500/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-all">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">AI Insights Hub</h3>
          <p className="text-slate-400 text-sm">Machine learning recommendations</p>
        </button>
      </motion.div>
    </div>
  );
}
