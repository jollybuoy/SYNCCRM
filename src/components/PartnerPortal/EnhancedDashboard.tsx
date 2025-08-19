import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, Target, Clock, Zap, 
  Brain, AlertTriangle, CheckCircle, ArrowUpRight, 
  Calendar, Filter, RefreshCw, Eye, MoreVertical
} from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import CustomPieChart from '../Charts/PieChart';
import CustomBarChart from '../Charts/BarChart';
import CustomLineChart from '../Charts/LineChart';
import AIInsights from '../AI/AIInsights';
import { opportunities, manufacturers, campaigns } from '../../data/sampleData';

export default function EnhancedDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');

  // Calculate KPIs
  const totalPipeline = opportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const avgDealSize = totalPipeline / opportunities.length;
  const winRate = 68; // Mock calculation
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  // Chart data
  const pipelineByStage = [
    { name: 'Prospecting', value: opportunities.filter(o => o.stage === 'prospecting').length, color: '#3B82F6' },
    { name: 'Proposal', value: opportunities.filter(o => o.stage === 'proposal').length, color: '#10B981' },
    { name: 'Negotiation', value: opportunities.filter(o => o.stage === 'negotiation').length, color: '#F59E0B' },
    { name: 'Contract', value: opportunities.filter(o => o.stage === 'contract').length, color: '#8B5CF6' }
  ];

  const manufacturerPerformance = manufacturers.map(m => {
    const manuOpps = opportunities.filter(o => o.manufacturerId === m.id);
    return {
      name: m.name,
      opportunities: manuOpps.length,
      revenue: manuOpps.reduce((sum, o) => sum + o.amount, 0) / 1000000,
      winRate: Math.floor(Math.random() * 30) + 60 // Mock data
    };
  });

  const monthlyTrend = Array.from({ length: 6 }, (_, i) => ({
    name: `Month ${i + 1}`,
    revenue: Math.floor(Math.random() * 5) + 8,
    opportunities: Math.floor(Math.random() * 20) + 30,
    won: Math.floor(Math.random() * 10) + 15
  }));

  const kpiCards = [
    {
      title: 'Total Pipeline',
      value: `$${(totalPipeline / 1000000).toFixed(1)}M`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Win Rate',
      value: `${winRate}%`,
      change: '+5.2%',
      trend: 'up',
      icon: Target,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Avg Deal Size',
      value: `$${(avgDealSize / 1000).toFixed(0)}K`,
      change: '+8.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Active Campaigns',
      value: activeCampaigns.toString(),
      change: '+2',
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Intelligence Dashboard</h1>
          <p className="text-gray-600 mt-1">AI-powered insights across all your manufacturers</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-r ${kpi.color} text-white hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{kpi.title}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-white/80 mr-1" />
                    <span className="text-white/80 text-sm">{kpi.change} vs last period</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Insights Section */}
      <AIInsights />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pipeline by Stage</h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <CustomPieChart data={pipelineByStage} height={300} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Manufacturer Performance</h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Eye className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <CustomBarChart
              data={manufacturerPerformance}
              height={300}
              bars={[
                { dataKey: 'opportunities', fill: '#3B82F6', name: 'Opportunities' },
                { dataKey: 'revenue', fill: '#10B981', name: 'Revenue (M)' }
              ]}
            />
          </Card>
        </motion.div>
      </div>

      {/* Trend Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">6-Month Performance Trend</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="success" size="sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending Up
              </Badge>
            </div>
          </div>
          <CustomLineChart
            data={monthlyTrend}
            height={350}
            lines={[
              { dataKey: 'revenue', stroke: '#3B82F6', name: 'Revenue (M)' },
              { dataKey: 'opportunities', stroke: '#10B981', name: 'Opportunities' },
              { dataKey: 'won', stroke: '#8B5CF6', name: 'Won Deals' }
            ]}
          />
        </Card>
      </motion.div>

      {/* Real-time Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { type: 'opportunity', message: 'New opportunity created: MIT Campus Expansion', time: '2 min ago', icon: Target, color: 'text-blue-600' },
              { type: 'sync', message: 'G&W Electric sync completed successfully', time: '5 min ago', icon: CheckCircle, color: 'text-green-600' },
              { type: 'alert', message: 'Johns Hopkins deal requires attention', time: '8 min ago', icon: AlertTriangle, color: 'text-yellow-600' },
              { type: 'ai', message: 'AI identified high-value prospect: Stanford University', time: '12 min ago', icon: Brain, color: 'text-purple-600' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-lg bg-white ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}