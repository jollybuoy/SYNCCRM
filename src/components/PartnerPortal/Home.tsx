import React from 'react';
import { CheckCircle, Clock, AlertTriangle, DollarSign, TrendingUp, Users, Calendar, Target, Phone, Mail, FileText, Zap, Activity } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import { currentUser, opportunities, activities, customers, manufacturers, campaigns } from '../../data/sampleData';

export default function Home() {
  const openOpportunities = opportunities.filter(opp => !['won', 'lost'].includes(opp.stage)).length;
  const dueSoon = activities.filter(act => !act.completedDate && act.dueDate && 
    new Date(act.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length;
  const overdue = activities.filter(act => !act.completedDate && act.dueDate && 
    new Date(act.dueDate) < new Date()).length;
  const totalForecast = opportunities
    .filter(opp => !['won', 'lost'].includes(opp.stage))
    .reduce((sum, opp) => sum + (opp.amount * (opp.probability || 50) / 100), 0);
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const syncHealthy = manufacturers.filter(m => m.status === 'connected').length;

  const checklistItems = [
    { id: 1, title: 'Connect manufacturer integrations', completed: true },
    { id: 2, title: 'Update your profile', completed: true },
    { id: 3, title: 'Import customer database', completed: false },
    { id: 4, title: 'Set up notification preferences', completed: false },
    { id: 5, title: 'Create your first campaign', completed: activeCampaigns > 0 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {currentUser.firstName}!
            </h1>
            <p className="text-blue-100">
              Here's your multi-manufacturer sales overview for today.
            </p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-blue-100">{syncHealthy} of {manufacturers.length} manufacturers synced</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-200" />
                <span className="text-sm text-blue-100">Real-time sync enabled</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">{openOpportunities}</p>
              <p className="text-sm text-blue-600">Across {manufacturers.length} manufacturers</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
              <p className="text-sm text-green-600">
                {campaigns.reduce((sum, c) => sum + c.metrics.customersTargeted, 0)} customers targeted
              </p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Due This Week</p>
              <p className="text-2xl font-bold text-gray-900">{dueSoon}</p>
              <p className="text-sm text-yellow-600">{overdue} overdue</p>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pipeline Forecast</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalForecast / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-purple-600">Weighted by probability</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manufacturer Sync Status */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Manufacturer Sync Status</h2>
          <div className="space-y-3">
            {manufacturers.map((manufacturer) => (
              <div key={manufacturer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{manufacturer.logo}</div>
                  <div>
                    <p className="font-medium text-gray-900">{manufacturer.name}</p>
                    <p className="text-sm text-gray-600">{manufacturer.industry}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    manufacturer.status === 'connected' ? 'bg-green-500' :
                    manufacturer.status === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <Badge variant={
                    manufacturer.status === 'connected' ? 'success' :
                    manufacturer.status === 'syncing' ? 'warning' : 'error'
                  } size="sm">
                    {manufacturer.status}
                  </Badge>
                  {manufacturer.syncFrequency === 'realtime' && (
                    <Badge variant="info" size="sm">Real-time</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Last sync: {new Date().toLocaleTimeString()}
          </div>
        </Card>

        {/* Getting Started Checklist */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-3">
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                {item.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                )}
                <span className={item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Complete these steps to maximize your multi-manufacturer CRM efficiency.
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {activities.slice(0, 4).map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-gray-100">
                {activity.type === 'call' && <Phone className="h-4 w-4 text-gray-600" />}
                {activity.type === 'visit' && <Users className="h-4 w-4 text-gray-600" />}
                {activity.type === 'email' && <Mail className="h-4 w-4 text-gray-600" />}
                {activity.type === 'note' && <FileText className="h-4 w-4 text-gray-600" />}
                {activity.type === 'demo' && <Users className="h-4 w-4 text-gray-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Priority: {activity.priority} • {activity.location}
                </p>
                {activity.dueDate && (
                  <p className="text-xs text-gray-400 mt-1">
                    Due: {new Date(activity.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              {activity.completedDate ? (
                <Badge variant="success">Completed</Badge>
              ) : activity.priority === 'urgent' ? (
                <Badge variant="error">Urgent</Badge>
              ) : activity.dueDate && new Date(activity.dueDate) < new Date() ? (
                <Badge variant="error">Overdue</Badge>
              ) : (
                <Badge variant="neutral">Pending</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}