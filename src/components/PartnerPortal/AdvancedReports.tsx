import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, PieChart, TrendingUp, Calendar, Download, Filter, 
  Clock, DollarSign, Target, Users, Zap, Brain, FileText, 
  ChevronDown, RefreshCw, Eye, Share2
} from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import CustomPieChart from '../Charts/PieChart';
import CustomBarChart from '../Charts/BarChart';
import CustomLineChart from '../Charts/LineChart';
import { opportunities, manufacturers } from '../../data/sampleData';
import { format, subDays, subMonths } from 'date-fns';

export default function AdvancedReports() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate opportunity stage duration data
  const stageData = opportunities.map(opp => {
    const createdDate = new Date(opp.lastActivity);
    const now = new Date();
    const daysInStage = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      ...opp,
      daysInStage,
      stageCategory: daysInStage < 30 ? 'Fresh' : daysInStage < 60 ? 'Active' : daysInStage < 90 ? 'Aging' : 'Stale'
    };
  });

  // Pie chart data for opportunity stages
  const stagePieData = [
    { name: 'Prospecting', value: opportunities.filter(o => o.stage === 'prospecting').length, color: '#3B82F6' },
    { name: 'Proposal', value: opportunities.filter(o => o.stage === 'proposal').length, color: '#10B981' },
    { name: 'Negotiation', value: opportunities.filter(o => o.stage === 'negotiation').length, color: '#F59E0B' },
    { name: 'Contract', value: opportunities.filter(o => o.stage === 'contract').length, color: '#8B5CF6' },
    { name: 'Won', value: opportunities.filter(o => o.stage === 'won').length, color: '#059669' },
    { name: 'Lost', value: opportunities.filter(o => o.stage === 'lost').length, color: '#DC2626' }
  ];

  // Bar chart data for manufacturer performance
  const manufacturerBarData = manufacturers.map(m => {
    const manuOpps = opportunities.filter(o => o.manufacturerId === m.id);
    return {
      name: m.name,
      opportunities: manuOpps.length,
      revenue: manuOpps.reduce((sum, o) => sum + o.amount, 0) / 1000000,
      avgDeal: manuOpps.length > 0 ? manuOpps.reduce((sum, o) => sum + o.amount, 0) / manuOpps.length / 1000 : 0
    };
  });

  // Line chart data for trend analysis
  const trendData = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i);
    const monthOpps = opportunities.filter(o => {
      const oppDate = new Date(o.lastActivity);
      return oppDate.getMonth() === date.getMonth() && oppDate.getFullYear() === date.getFullYear();
    });
    
    return {
      name: format(date, 'MMM yyyy'),
      opportunities: monthOpps.length,
      revenue: monthOpps.reduce((sum, o) => sum + o.amount, 0) / 1000000,
      won: monthOpps.filter(o => o.stage === 'won').length
    };
  });

  // Stage duration analysis
  const stageDurationData = [
    { name: 'Fresh (0-30 days)', value: stageData.filter(o => o.stageCategory === 'Fresh').length, color: '#10B981' },
    { name: 'Active (31-60 days)', value: stageData.filter(o => o.stageCategory === 'Active').length, color: '#3B82F6' },
    { name: 'Aging (61-90 days)', value: stageData.filter(o => o.stageCategory === 'Aging').length, color: '#F59E0B' },
    { name: 'Stale (90+ days)', value: stageData.filter(o => o.stageCategory === 'Stale').length, color: '#DC2626' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pipeline', label: 'Pipeline Analysis', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: Target },
    { id: 'forecasting', label: 'AI Forecasting', icon: Brain },
    { id: 'custom', label: 'Custom Reports', icon: FileText }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">AI-powered insights and comprehensive business intelligence</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>
          
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Pipeline</p>
                    <p className="text-2xl font-bold">
                      ${(opportunities.reduce((sum, o) => sum + o.amount, 0) / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-blue-100 text-sm">+12% vs last period</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Win Rate</p>
                    <p className="text-2xl font-bold">68%</p>
                    <p className="text-green-100 text-sm">+5% vs last period</p>
                  </div>
                  <Target className="h-8 w-8 text-green-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Avg. Deal Size</p>
                    <p className="text-2xl font-bold">
                      ${(opportunities.reduce((sum, o) => sum + o.amount, 0) / opportunities.length / 1000).toFixed(0)}K
                    </p>
                    <p className="text-purple-100 text-sm">+8% vs last period</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-200" />
                </div>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Sales Cycle</p>
                    <p className="text-2xl font-bold">45 days</p>
                    <p className="text-orange-100 text-sm">-3 days vs last period</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-200" />
                </div>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CustomPieChart 
                  data={stagePieData} 
                  title="Opportunities by Stage"
                  height={350}
                />
              </Card>

              <Card>
                <CustomBarChart
                  data={manufacturerBarData}
                  title="Performance by Manufacturer"
                  height={350}
                  bars={[
                    { dataKey: 'opportunities', fill: '#3B82F6', name: 'Opportunities' },
                    { dataKey: 'revenue', fill: '#10B981', name: 'Revenue (M)' }
                  ]}
                />
              </Card>
            </div>

            {/* Trend Analysis */}
            <Card>
              <CustomLineChart
                data={trendData}
                title="12-Month Trend Analysis"
                height={400}
                lines={[
                  { dataKey: 'opportunities', stroke: '#3B82F6', name: 'Opportunities' },
                  { dataKey: 'revenue', stroke: '#10B981', name: 'Revenue (M)' },
                  { dataKey: 'won', stroke: '#8B5CF6', name: 'Won Deals' }
                ]}
              />
            </Card>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CustomPieChart 
                  data={stageDurationData} 
                  title="Opportunity Age Distribution"
                  height={350}
                />
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">
                      {stageData.filter(o => o.stageCategory === 'Stale').length} opportunities need immediate attention
                    </span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stage Velocity Analysis</h3>
                <div className="space-y-4">
                  {['prospecting', 'proposal', 'negotiation', 'contract'].map((stage) => {
                    const stageOpps = stageData.filter(o => o.stage === stage);
                    const avgDays = stageOpps.length > 0 
                      ? stageOpps.reduce((sum, o) => sum + o.daysInStage, 0) / stageOpps.length 
                      : 0;
                    
                    return (
                      <div key={stage} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{stage}</p>
                          <p className="text-sm text-gray-600">{stageOpps.length} opportunities</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{Math.round(avgDays)} days</p>
                          <p className="text-sm text-gray-600">avg. duration</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Detailed Stage Analysis */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Opportunities Requiring Attention</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opportunity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Days in Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stageData
                      .filter(o => o.daysInStage > 60)
                      .sort((a, b) => b.daysInStage - a.daysInStage)
                      .slice(0, 10)
                      .map((opp) => (
                        <tr key={opp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{opp.name}</div>
                            <div className="text-sm text-gray-500">{opp.customerName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="info" size="sm">{opp.stage}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {opp.daysInStage} days
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${opp.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={
                              opp.daysInStage > 90 ? 'error' : 
                              opp.daysInStage > 60 ? 'warning' : 'success'
                            } size="sm">
                              {opp.daysInStage > 90 ? 'High' : 
                               opp.daysInStage > 60 ? 'Medium' : 'Low'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">AI-Powered Forecast</h3>
                  <p className="text-purple-100">Machine learning predictions based on historical data and market trends</p>
                </div>
                <Brain className="h-12 w-12 text-purple-200" />
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <div className="text-center">
                  <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Q2 Forecast</h3>
                  <p className="text-3xl font-bold text-green-600 my-2">$12.4M</p>
                  <p className="text-sm text-gray-600">85% confidence</p>
                  <div className="mt-4 bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">+18% vs Q1 actual</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Win Rate Prediction</h3>
                  <p className="text-3xl font-bold text-blue-600 my-2">72%</p>
                  <p className="text-sm text-gray-600">Based on current pipeline</p>
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">+4% improvement expected</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Avg. Sales Cycle</h3>
                  <p className="text-3xl font-bold text-purple-600 my-2">42 days</p>
                  <p className="text-sm text-gray-600">Predicted reduction</p>
                  <div className="mt-4 bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-800">-3 days vs current</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* AI Recommendations */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                AI Recommendations
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900">Focus on Healthcare Vertical</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    AI analysis shows 23% higher close rates in healthcare. Recommend allocating 40% more resources.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900">Optimize Follow-up Timing</h4>
                  <p className="text-green-800 text-sm mt-1">
                    Contacts respond 3x better on Tuesday-Thursday, 10-11 AM. Adjust outreach schedule accordingly.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-900">Risk Alert: Large Deals</h4>
                  <p className="text-yellow-800 text-sm mt-1">
                    3 high-value opportunities show stagnation patterns. Immediate intervention recommended.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}