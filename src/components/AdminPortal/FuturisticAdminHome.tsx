import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Cpu, Database, Network, Activity, Zap, Brain, Eye,
  Server, Lock, Globe, BarChart3, Users, Settings, AlertTriangle,
  CheckCircle, TrendingUp, Clock, ArrowUpRight, Layers, Command
} from 'lucide-react';
import { integrations, manufacturers, syncLogs } from '../../data/sampleData';

const AdminStatCard = ({ title, value, change, icon: Icon, gradient, delay = 0, status }: any) => (
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
        <div className="flex items-center space-x-2">
          {status && (
            <div className={`w-3 h-3 rounded-full ${
              status === 'healthy' ? 'bg-green-400 animate-pulse' :
              status === 'warning' ? 'bg-yellow-400 animate-pulse' :
              'bg-red-400 animate-pulse'
            }`}></div>
          )}
          <ArrowUpRight className="h-5 w-5 opacity-60" />
        </div>
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

const SystemMetricCard = ({ title, description, value, trend, icon: Icon, delay = 0 }: any) => (
  <motion.div
    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-start space-x-4">
      <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-3">{description}</p>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function FuturisticAdminHome() {
  const activeIntegrations = integrations.filter(i => i.status === 'active').length;
  const totalApiCalls = integrations.reduce((sum, i) => sum + i.apiUsageToday, 0);
  const errorCount = integrations.reduce((sum, i) => sum + i.errorCount, 0);
  const syncSuccessRate = ((syncLogs.filter(log => log.status === 'success').length / syncLogs.length) * 100).toFixed(1);

  const systemMetrics = [
    {
      title: "AI Processing Power",
      description: "Neural network computation capacity utilization",
      value: "94.7%",
      trend: 12,
      icon: Brain
    },
    {
      title: "Data Throughput",
      description: "Real-time data processing and synchronization rate",
      value: "2.4TB/h",
      trend: 8,
      icon: Database
    },
    {
      title: "Network Latency",
      description: "Global edge network response time optimization",
      value: "12ms",
      trend: -15,
      icon: Network
    },
    {
      title: "Security Score",
      description: "Quantum encryption and threat detection status",
      value: "99.9%",
      trend: 2,
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 mb-8 text-white"
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
              System Control Center 🛡️
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Advanced AI-powered platform administration and monitoring
            </motion.p>
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/90">All Systems Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-white/80" />
                <span className="text-white/90">12 Servers Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-white/80" />
                <span className="text-white/90">Quantum Security Enabled</span>
              </div>
            </motion.div>
          </div>
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </motion.div>
        </div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
      </motion.div>

      {/* System Status KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminStatCard
          title="Active Integrations"
          value={activeIntegrations}
          change={`${manufacturers.length} manufacturers connected`}
          icon={Zap}
          gradient="from-purple-500 to-violet-500"
          delay={0.1}
          status="healthy"
        />
        <AdminStatCard
          title="API Throughput"
          value={`${(totalApiCalls / 1000).toFixed(1)}K`}
          change="+23% vs yesterday"
          icon={Activity}
          gradient="from-blue-500 to-cyan-500"
          delay={0.2}
          status="healthy"
        />
        <AdminStatCard
          title="Sync Success Rate"
          value={`${syncSuccessRate}%`}
          change={`${errorCount} errors detected`}
          icon={CheckCircle}
          gradient="from-green-500 to-emerald-500"
          delay={0.3}
          status={errorCount > 5 ? "warning" : "healthy"}
        />
        <AdminStatCard
          title="AI Engine Load"
          value="94.7%"
          change="Optimal performance"
          icon={Cpu}
          gradient="from-orange-500 to-red-500"
          delay={0.4}
          status="healthy"
        />
      </div>

      {/* System Metrics Grid */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Command className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">System Intelligence</h2>
              <p className="text-slate-400">Real-time platform performance metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">All Systems Go</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {systemMetrics.map((metric, index) => (
            <SystemMetricCard
              key={index}
              {...metric}
              delay={0.6 + index * 0.1}
            />
          ))}
        </div>
      </motion.div>

      {/* Integration Status and Activity Feed */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {/* Integration Health */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Integration Health</h3>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm">Global Network</span>
            </div>
          </div>
          <div className="space-y-4">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{manufacturers.find(m => m.id === integration.manufacturerId)?.logo}</div>
                  <div>
                    <p className="font-semibold text-white">{integration.manufacturerName}</p>
                    <p className="text-sm text-slate-400">{integration.crm} • {integration.environment}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    integration.status === 'active' ? 'bg-green-400 animate-pulse' :
                    integration.status === 'syncing' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                  }`}></div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    integration.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    integration.status === 'syncing' ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {integration.status}
                  </div>
                  <div className="text-xs text-slate-400">
                    {integration.apiUsageToday.toLocaleString()} calls
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Activity Feed */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">System Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-400 text-sm">Live Monitoring</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { type: 'security', message: 'Quantum encryption keys rotated successfully', time: '1 min ago', icon: Lock, color: 'text-green-400' },
              { type: 'sync', message: 'G&W Electric integration health check passed', time: '3 min ago', icon: CheckCircle, color: 'text-blue-400' },
              { type: 'ai', message: 'AI model training completed - 99.2% accuracy', time: '5 min ago', icon: Brain, color: 'text-purple-400' },
              { type: 'alert', message: 'High API usage detected on Siemens integration', time: '8 min ago', icon: AlertTriangle, color: 'text-yellow-400' },
              { type: 'system', message: 'Database optimization completed - 15% faster queries', time: '12 min ago', icon: Database, color: 'text-cyan-400' }
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

      {/* Quick Admin Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <button className="p-6 bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-2xl text-left hover:from-purple-500/30 hover:to-violet-500/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-all">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Integration Hub</h3>
          <p className="text-slate-400 text-sm">Manage API connections and sync settings</p>
        </button>

        <button className="p-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl text-left hover:from-blue-500/30 hover:to-cyan-500/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-all">
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Sync Intelligence</h3>
          <p className="text-slate-400 text-sm">Monitor real-time data synchronization</p>
        </button>

        <button className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl text-left hover:from-green-500/30 hover:to-emerald-500/30 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-all">
              <BarChart3 className="h-6 w-6 text-green-400" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-green-400 opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">System Analytics</h3>
          <p className="text-slate-400 text-sm">Advanced platform performance insights</p>
        </button>
      </motion.div>
    </div>
  );
}