import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Eye, Edit, ArrowUpDown, RefreshCw, X, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Modal from '../UI/Modal';
import Table from '../UI/Table';
import { opportunities, manufacturers } from '../../data/sampleData';
import { Opportunity } from '../../types';

interface OpportunityDrawerProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

function OpportunityDrawer({ opportunity, isOpen, onClose }: OpportunityDrawerProps) {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 bg-white shadow-xl z-50 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{opportunity.name}</h2>
            <p className="text-sm text-gray-600">{opportunity.manufacturerName}</p>
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
            { id: 'details', label: 'Details' },
            { id: 'sync', label: 'Sync Status' },
            { id: 'activities', label: 'Activities' },
            { id: 'files', label: 'Files' }
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
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Sync Phase Indicator */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">Sync Phase</h4>
                <Badge variant={
                  opportunity.syncPhase === 'confirmed' ? 'success' :
                  opportunity.syncPhase === 'approval' ? 'warning' :
                  opportunity.syncPhase === 'validation' ? 'info' : 'neutral'
                }>
                  {opportunity.syncPhase}
                </Badge>
              </div>
              <div className="flex space-x-2">
                {['draft', 'validation', 'approval', 'sync', 'confirmed'].map((phase, index) => (
                  <div key={phase} className="flex-1">
                    <div className={`h-2 rounded-full ${
                      ['draft', 'validation', 'approval', 'sync', 'confirmed'].indexOf(opportunity.syncPhase) >= index
                        ? 'bg-blue-600' : 'bg-gray-200'
                    }`}></div>
                    <p className="text-xs text-gray-600 mt-1 capitalize">{phase}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <p className="mt-1 text-sm text-gray-900">{opportunity.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                <p className="mt-1 text-sm text-gray-900">{opportunity.manufacturerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stage</label>
                <Badge variant="info" size="md">
                  {opportunity.stage}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <p className="mt-1 text-sm text-gray-900">
                  ${opportunity.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Close Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(opportunity.closeDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Probability</label>
                <p className="mt-1 text-sm text-gray-900">{opportunity.probability}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Region</label>
                <p className="mt-1 text-sm text-gray-900">{opportunity.region}</p>
              </div>
            </div>
            
            {opportunity.products && opportunity.products.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Products</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {opportunity.products.map((product, index) => (
                    <Badge key={index} variant="neutral" size="sm">{product}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {opportunity.competitors && opportunity.competitors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Competitors</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {opportunity.competitors.map((competitor, index) => (
                    <Badge key={index} variant="warning" size="sm">{competitor}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {opportunity.endUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700">End User</label>
                <p className="mt-1 text-sm text-gray-900">{opportunity.endUser}</p>
              </div>
            )}
            
            {opportunity.consultant && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Consultant</label>
                <p className="mt-1 text-sm text-gray-900">{opportunity.consultant}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-4">
            {/* Current Sync Status */}
            <div className={`flex items-center justify-between p-4 rounded-lg ${
              opportunity.syncStatus === 'synced' ? 'bg-green-50' :
              opportunity.syncStatus === 'pending' ? 'bg-yellow-50' :
              opportunity.syncStatus === 'error' ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center">
                {opportunity.syncStatus === 'synced' && <CheckCircle className="h-5 w-5 text-green-600 mr-2" />}
                {opportunity.syncStatus === 'pending' && <Clock className="h-5 w-5 text-yellow-600 mr-2" />}
                {opportunity.syncStatus === 'error' && <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />}
                <Badge variant={
                  opportunity.syncStatus === 'synced' ? 'success' :
                  opportunity.syncStatus === 'pending' ? 'warning' :
                  opportunity.syncStatus === 'error' ? 'error' : 'neutral'
                }>
                  {opportunity.syncStatus}
                </Badge>
                <span className="ml-2 text-sm text-gray-600">
                  Last synced: {new Date(opportunity.lastActivity).toLocaleString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-50">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sync Now
                </button>
                {opportunity.syncStatus === 'error' && (
                  <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                    Retry
                  </button>
                )}
              </div>
            </div>
            
            {/* Sync Phase Timeline */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Sync Phase Progress</h4>
              <div className="space-y-3">
                {['draft', 'validation', 'approval', 'sync', 'confirmed'].map((phase, index) => {
                  const isActive = ['draft', 'validation', 'approval', 'sync', 'confirmed'].indexOf(opportunity.syncPhase) === index;
                  const isCompleted = ['draft', 'validation', 'approval', 'sync', 'confirmed'].indexOf(opportunity.syncPhase) > index;
                  
                  return (
                    <div key={phase} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        isCompleted ? 'bg-green-500 border-green-500' :
                        isActive ? 'bg-blue-500 border-blue-500' :
                        'bg-white border-gray-300'
                      }`}>
                        {isCompleted && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-600'
                        }`}>
                          {phase.charAt(0).toUpperCase() + phase.slice(1)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {phase === 'draft' && 'Opportunity created locally'}
                          {phase === 'validation' && 'Data validation in progress'}
                          {phase === 'approval' && 'Awaiting approval for sync'}
                          {phase === 'sync' && 'Syncing to manufacturer CRM'}
                          {phase === 'confirmed' && 'Successfully synced and confirmed'}
                        </p>
                      </div>
                      {isActive && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Sync Details</h4>
              <pre className="text-xs text-gray-600 overflow-x-auto">
                {JSON.stringify({ 
                  status: opportunity.syncStatus, 
                  phase: opportunity.syncPhase,
                  timestamp: opportunity.lastActivity,
                  manufacturer: opportunity.manufacturerName,
                  recordId: opportunity.id
                }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Opportunities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewOpportunityOpen, setIsNewOpportunityOpen] = useState(false);

  const filteredOpportunities = opportunities.filter(opp =>
    opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.accountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      key: 'name',
      label: 'Opportunity Name',
      render: (value: string) => (
        <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
          {value}
        </div>
      )
    },
    {
      key: 'manufacturerName',
      label: 'Manufacturer',
      render: (value: string, opportunity: Opportunity) => (
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{manufacturers.find(m => m.id === opportunity.manufacturerId)?.logo}</span>
          <span className="text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value: string) => <span className="text-gray-900">{value}</span>
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (value: string) => (
        <Badge variant="info" size="md">
          {value}
        </Badge>
      )
    },
    {
      key: 'amount',
      label: 'Amount (USD)',
      render: (value: number) => (
        <span className="font-medium text-gray-900">
          ${value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'closeDate',
      label: 'Close Date',
      render: (value: string) => (
        <span className="text-gray-900">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'lastActivity',
      label: 'Last Activity',
      render: (value: string) => (
        <span className="text-gray-600 text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'syncPhase',
      label: 'Sync Phase',
      render: (value: string) => (
        <Badge
          variant={
            value === 'confirmed' ? 'success' :
            value === 'approval' ? 'warning' : 'info'
          }
          size="sm"
        >
          {value}
        </Badge>
      )
    },
    {
      key: 'syncStatus',
      label: 'Sync Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'success' ? 'success' :
            value === 'warning' ? 'warning' :
            value === 'error' ? 'error' : 'neutral'
          }
        >
          {value}
        </Badge>
      )
    }
  ];

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
            <p className="text-gray-600 mt-1">Manage opportunities across all manufacturers</p>
          </div>
          <button
            onClick={() => setIsNewOpportunityOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Opportunity
          </button>
        </div>

        {/* Toolbar */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </button>
            </div>
          </div>
        </Card>

        {/* Opportunities Table */}
        <Card padding="sm">
          <Table
            columns={columns}
            data={filteredOpportunities}
            onRowClick={handleRowClick}
          />
        </Card>
      </div>

      {/* Opportunity Drawer */}
      <OpportunityDrawer
        opportunity={selectedOpportunity}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* New Opportunity Modal */}
      <Modal
        isOpen={isNewOpportunityOpen}
        onClose={() => setIsNewOpportunityOpen(false)}
        title="Create New Opportunity"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Opportunity Name *
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter opportunity name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Manufacturer *
              </label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select manufacturer</option>
                {manufacturers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer *
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stage *
              </label>
              <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="prospecting">Prospecting</option>
                <option value="qualification">Qualification</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (USD)
              </label>
              <input
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Close Date
              </label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Products/Solutions
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter products or solutions (comma separated)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter opportunity description..."
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsNewOpportunityOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Create & Start Sync
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
