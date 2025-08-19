import React, { useState } from 'react';
import { Plus, Settings, Pause, Play, AlertTriangle, CheckCircle, TestTube } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Modal from '../UI/Modal';
import { integrations, manufacturers } from '../../data/sampleData';

export default function Integrations() {
  const [isAddIntegrationOpen, setIsAddIntegrationOpen] = useState(false);
  const [selectedCRM, setSelectedCRM] = useState('');

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600 mt-1">Manage manufacturer CRM connections</p>
          </div>
          <button
            onClick={() => setIsAddIntegrationOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Integration
          </button>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{
                    manufacturers.find(m => m.id === integration.manufacturerId)?.logo
                  }</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {integration.manufacturerName}
                    </h3>
                    <p className="text-sm text-gray-600">{integration.crm}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    integration.status === 'active' ? 'bg-green-500' :
                    integration.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <Badge variant={
                    integration.status === 'active' ? 'success' :
                    integration.status === 'error' ? 'error' : 'warning'
                  }>
                    {integration.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Sync:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(integration.lastSync).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">API Usage Today:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {integration.apiUsageToday.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Errors:</span>
                  <span className={`text-sm font-medium ${
                    integration.errorCount > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {integration.errorCount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Environment:</span>
                  <Badge variant={integration.environment === 'production' ? 'success' : 'warning'}>
                    {integration.environment}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </button>
                  
                  {integration.status === 'active' ? (
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <Pause className="h-4 w-4" />
                    </button>
                  ) : (
                    <button className="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100">
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100">
                    <TestTube className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Errors Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.reduce((sum, i) => sum + i.errorCount, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total API Calls</p>
                <p className="text-2xl font-bold text-gray-900">
                  {integrations.reduce((sum, i) => sum + i.apiUsageToday, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Integration Modal */}
      <Modal
        isOpen={isAddIntegrationOpen}
        onClose={() => setIsAddIntegrationOpen(false)}
        title="Add New Integration"
        size="lg"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manufacturer
            </label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select manufacturer</option>
              {manufacturers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              CRM Platform
            </label>
            <select
              value={selectedCRM}
              onChange={(e) => setSelectedCRM(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Select CRM</option>
              <option value="salesforce">Salesforce</option>
              <option value="hubspot">HubSpot</option>
              <option value="zoho">Zoho</option>
              <option value="dynamics">Microsoft Dynamics</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Environment
            </label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="environment"
                  value="sandbox"
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Sandbox</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="environment"
                  value="production"
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Production</span>
              </label>
            </div>
          </div>

          {selectedCRM && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                {selectedCRM === 'salesforce' ? 'Salesforce' : 
                 selectedCRM === 'hubspot' ? 'HubSpot' :
                 selectedCRM === 'zoho' ? 'Zoho' : 'Microsoft Dynamics'} Authentication
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                You'll be redirected to {selectedCRM === 'salesforce' ? 'Salesforce' : 
                 selectedCRM === 'hubspot' ? 'HubSpot' :
                 selectedCRM === 'zoho' ? 'Zoho' : 'Microsoft Dynamics'} to authorize the connection.
              </p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Authorize Connection
              </button>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddIntegrationOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              disabled={!selectedCRM}
            >
              Create Integration
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}