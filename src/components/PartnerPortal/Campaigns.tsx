import React, { useState } from 'react';
import { Plus, Target, Users, Calendar, TrendingUp, MapPin, Filter, Eye, Edit, Play, Pause } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Modal from '../UI/Modal';
import Table from '../UI/Table';
import { campaigns, customers, manufacturers } from '../../data/sampleData';
import { Campaign, Customer } from '../../types';

interface CampaignDetailsProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

function CampaignDetails({ campaign, isOpen, onClose }: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !campaign) return null;

  const targetCustomers = customers.filter(c => campaign.targetCustomers.includes(c.id));
  const progressPercentage = (campaign.metrics.customersContacted / campaign.metrics.customersTargeted) * 100;

  return (
    <div className="fixed inset-y-0 right-0 w-2/3 bg-white shadow-xl z-50 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{campaign.name}</h2>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant={
                campaign.status === 'active' ? 'success' :
                campaign.status === 'paused' ? 'warning' :
                campaign.status === 'completed' ? 'info' : 'neutral'
              }>
                {campaign.status}
              </Badge>
              <Badge variant="neutral">{campaign.type}</Badge>
              <span className="text-sm text-gray-600">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'customers', label: 'Target Customers' },
            { id: 'activities', label: 'Activities' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{campaign.metrics.customersTargeted}</p>
                <p className="text-sm text-blue-600">Customers Targeted</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{campaign.metrics.customersContacted}</p>
                <p className="text-sm text-green-600">Customers Contacted</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">{campaign.metrics.meetingsScheduled}</p>
                <p className="text-sm text-purple-600">Meetings Scheduled</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-900">${(campaign.metrics.revenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-orange-600">Revenue Generated</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Campaign Progress</span>
                <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Goals */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Goals</h3>
              <div className="space-y-3">
                {campaign.goals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{goal.description}</p>
                      <p className="text-sm text-gray-600">{goal.achieved} of {goal.target} {goal.unit}</p>
                    </div>
                    <div className="text-right">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.min((goal.achieved / goal.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {Math.round((goal.achieved / goal.target) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{campaign.description}</p>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Target Customers</h3>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Customers
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {targetCustomers.map((customer) => (
                <div key={customer.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{customer.name}</h4>
                      <p className="text-sm text-gray-600">{customer.location.city}, {customer.location.state}</p>
                    </div>
                    <Badge variant="neutral" size="sm">{customer.type}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Potential Value:</span>
                      <span className="font-medium text-green-600">
                        ${(customer.potentialValue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Contact:</span>
                      <span className="text-gray-900">
                        {customer.lastInteraction ? new Date(customer.lastInteraction).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50">
                      Schedule Visit
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Analytics</h3>
            
            {/* Conversion Funnel */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">Conversion Funnel</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-32 text-sm text-gray-600">Targeted</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 mx-4">
                    <div className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2" style={{ width: '100%' }}>
                      <span className="text-white text-xs font-medium">{campaign.metrics.customersTargeted}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 text-sm text-gray-600">Contacted</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 mx-4">
                    <div className="bg-green-600 h-6 rounded-full flex items-center justify-end pr-2" 
                         style={{ width: `${(campaign.metrics.customersContacted / campaign.metrics.customersTargeted) * 100}%` }}>
                      <span className="text-white text-xs font-medium">{campaign.metrics.customersContacted}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 text-sm text-gray-600">Meetings</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 mx-4">
                    <div className="bg-purple-600 h-6 rounded-full flex items-center justify-end pr-2" 
                         style={{ width: `${(campaign.metrics.meetingsScheduled / campaign.metrics.customersTargeted) * 100}%` }}>
                      <span className="text-white text-xs font-medium">{campaign.metrics.meetingsScheduled}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 text-sm text-gray-600">Opportunities</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 mx-4">
                    <div className="bg-orange-600 h-6 rounded-full flex items-center justify-end pr-2" 
                         style={{ width: `${(campaign.metrics.opportunitiesCreated / campaign.metrics.customersTargeted) * 100}%` }}>
                      <span className="text-white text-xs font-medium">{campaign.metrics.opportunitiesCreated}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-900">${(campaign.metrics.revenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600">Revenue Generated</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-900">${(campaign.budget || 0).toLocaleString()}</p>
                <p className="text-sm text-blue-600">Campaign Budget</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-900">
                  {campaign.budget ? Math.round((campaign.metrics.revenue / campaign.budget) * 100) : 0}%
                </p>
                <p className="text-sm text-purple-600">ROI</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filterStatus !== 'all' && campaign.status !== filterStatus) return false;
    if (filterType !== 'all' && campaign.type !== filterType) return false;
    return true;
  });

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailsOpen(true);
  };

  const columns = [
    {
      key: 'name',
      label: 'Campaign Name',
      render: (value: string, campaign: Campaign) => (
        <div>
          <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
            {value}
          </div>
          <div className="text-sm text-gray-500">{campaign.description.substring(0, 60)}...</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <Badge variant="neutral" size="sm">{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'active' ? 'success' :
          value === 'paused' ? 'warning' :
          value === 'completed' ? 'info' : 'neutral'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'metrics',
      label: 'Progress',
      render: (value: any, campaign: Campaign) => {
        const progress = (campaign.metrics.customersContacted / campaign.metrics.customersTargeted) * 100;
        return (
          <div className="w-24">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">{Math.round(progress)}%</p>
          </div>
        );
      }
    },
    {
      key: 'targetCustomers',
      label: 'Customers',
      render: (value: string[]) => (
        <span className="text-gray-900">{value.length}</span>
      )
    },
    {
      key: 'metrics',
      label: 'Revenue',
      render: (value: any) => (
        <span className="font-medium text-green-600">
          ${(value.revenue / 1000000).toFixed(1)}M
        </span>
      )
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (value: string) => (
        <span className="text-gray-900">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    }
  ];

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
            <p className="text-gray-600 mt-1">Create and manage targeted customer campaigns</p>
          </div>
          <button
            onClick={() => setIsNewCampaignOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </button>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customers Targeted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.reduce((sum, c) => sum + c.metrics.customersTargeted, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Meetings Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.reduce((sum, c) => sum + c.metrics.meetingsScheduled, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(campaigns.reduce((sum, c) => sum + c.metrics.revenue, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="university">University</option>
                <option value="hospital">Hospital</option>
                <option value="government">Government</option>
                <option value="location">Location</option>
                <option value="industry">Industry</option>
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

        {/* Campaigns Table */}
        <Card padding="sm">
          <Table
            columns={columns}
            data={filteredCampaigns}
            onRowClick={handleViewDetails}
          />
        </Card>
      </div>

      {/* Campaign Details Drawer */}
      <CampaignDetails
        campaign={selectedCampaign}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* New Campaign Modal */}
      <Modal
        isOpen={isNewCampaignOpen}
        onClose={() => setIsNewCampaignOpen(false)}
        title="Create New Campaign"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Campaign Name *
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter campaign name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Campaign Type *
              </label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select type</option>
                <option value="university">University</option>
                <option value="hospital">Hospital</option>
                <option value="government">Government</option>
                <option value="location">Location-based</option>
                <option value="industry">Industry-specific</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date *
              </label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Manufacturers
            </label>
            <div className="mt-2 space-y-2">
              {manufacturers.map(manufacturer => (
                <label key={manufacturer.id} className="inline-flex items-center mr-6">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{manufacturer.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Budget (Optional)
            </label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the campaign objectives and strategy..."
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsNewCampaignOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// Add missing import
import { X } from 'lucide-react';