import React, { useState } from 'react';
import { Filter, Download, RefreshCw, TrendingUp, DollarSign, Users, AlertCircle } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import { manufacturers, opportunities } from '../../data/sampleData';

export default function Dashboard() {
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');

  const filteredOpportunities = opportunities.filter(opp => {
    if (selectedManufacturer !== 'all' && opp.manufacturerId !== selectedManufacturer) return false;
    if (selectedStage !== 'all' && opp.stage !== selectedStage) return false;
    return true;
  });

  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const avgDealSize = totalValue / filteredOpportunities.length || 0;

  const stageData = [
    { stage: 'prospecting', count: filteredOpportunities.filter(o => o.stage === 'prospecting').length, color: 'bg-blue-500' },
    { stage: 'proposal', count: filteredOpportunities.filter(o => o.stage === 'proposal').length, color: 'bg-yellow-500' },
    { stage: 'negotiation', count: filteredOpportunities.filter(o => o.stage === 'negotiation').length, color: 'bg-orange-500' },
    { stage: 'po', count: filteredOpportunities.filter(o => o.stage === 'po').length, color: 'bg-green-500' },
  ];

  const maxStageCount = Math.max(...stageData.map(s => s.count));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Manufacturer Overview</h1>
          <p className="text-gray-600 mt-1">Track performance across all your manufacturers</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manufacturer
            </label>
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Manufacturers</option>
              {manufacturers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stage
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stages</option>
              <option value="prospecting">Prospecting</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="po">PO</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Sync Health Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-green-600">
              <h3 className="font-semibold">Sync Health Status</h3>
            </div>
            <div className="flex items-center space-x-6">
              {manufacturers.map(manufacturer => (
                <div key={manufacturer.id} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    manufacturer.status === 'connected' ? 'bg-green-500' :
                    manufacturer.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm font-medium">{manufacturer.name}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Open My Worklist
          </button>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">${(totalValue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600">+12% vs last quarter</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900">${(avgDealSize / 1000).toFixed(0)}K</p>
              <p className="text-sm text-green-600">+8% vs last quarter</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">{filteredOpportunities.length}</p>
              <p className="text-sm text-blue-600">Across {manufacturers.length} manufacturers</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Forecast Risk</p>
              <p className="text-2xl font-bold text-gray-900">Medium</p>
              <p className="text-sm text-orange-600">3 opportunities at risk</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline by Stage</h3>
          <div className="space-y-4">
            {stageData.map((stage) => (
              <div key={stage.stage} className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-600 capitalize">
                  {stage.stage}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-6 relative">
                    <div
                      className={`${stage.color} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: maxStageCount > 0 ? `${(stage.count / maxStageCount) * 100}%` : '0%' }}
                    >
                      {stage.count > 0 && (
                        <span className="text-white text-xs font-medium">{stage.count}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 w-12 text-right">
                  {stage.count}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity Timeline */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {opportunities.slice(0, 5).map((opp) => (
              <div key={opp.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{opp.name}</p>
                  <p className="text-sm text-gray-500">
                    {opp.manufacturerName} • Stage: {opp.stage} • ${(opp.amount / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-400">
                    Last updated: {new Date(opp.lastActivity).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={
                  opp.syncStatus === 'success' ? 'success' :
                  opp.syncStatus === 'warning' ? 'warning' :
                  opp.syncStatus === 'error' ? 'error' : 'neutral'
                }>
                  {opp.syncStatus}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}