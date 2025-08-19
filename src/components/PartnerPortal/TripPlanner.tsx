import React, { useState } from 'react';
import { MapPin, Route, Calendar, Clock, Plus, Target, Users, Zap, Filter } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Modal from '../UI/Modal';
import { customers, campaigns, activities } from '../../data/sampleData';
import { Customer, Campaign, PlannedVisit } from '../../types';

interface RouteOptimizationProps {
  startLocation: string;
  selectedCustomers: Customer[];
  onRouteGenerated: (visits: PlannedVisit[]) => void;
}

function RouteOptimization({ startLocation, selectedCustomers, onRouteGenerated }: RouteOptimizationProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizeRoute = () => {
    setIsOptimizing(true);
    
    // Simulate route optimization
    setTimeout(() => {
      const optimizedVisits: PlannedVisit[] = selectedCustomers.map((customer, index) => ({
        id: `visit-${Date.now()}-${index}`,
        customerId: customer.id,
        customerName: customer.name,
        scheduledTime: new Date(Date.now() + (index + 1) * 2 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 90,
        purpose: 'Business Development Visit',
        priority: customer.potentialValue > 3000000 ? 'high' : 'medium',
        distance: Math.floor(Math.random() * 50) + 10,
        travelTime: Math.floor(Math.random() * 60) + 15,
        status: 'planned'
      }));
      
      onRouteGenerated(optimizedVisits);
      setIsOptimizing(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Route Optimization</h3>
        <button
          onClick={optimizeRoute}
          disabled={isOptimizing || selectedCustomers.length === 0}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isOptimizing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Optimizing...
            </>
          ) : (
            <>
              <Route className="mr-2 h-4 w-4" />
              Optimize Route
            </>
          )}
        </button>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <MapPin className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-900">Starting Location</span>
        </div>
        <p className="text-sm text-blue-700">{startLocation}</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Selected Customers ({selectedCustomers.length})</h4>
        {selectedCustomers.map((customer) => (
          <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">{customer.name}</p>
              <p className="text-xs text-gray-600">{customer.location.city}, {customer.location.state}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">
                ${(customer.potentialValue / 1000000).toFixed(1)}M
              </p>
              <Badge variant={customer.potentialValue > 3000000 ? 'success' : 'info'} size="sm">
                {customer.potentialValue > 3000000 ? 'High Value' : 'Medium Value'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TripPlanner() {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [startLocation, setStartLocation] = useState('Boston, MA');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [plannedVisits, setPlannedVisits] = useState<PlannedVisit[]>([]);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredCustomers = customers.filter(customer => {
    if (filterType === 'all') return true;
    return customer.type === filterType;
  });

  const handleCustomerSelect = (customer: Customer) => {
    if (selectedCustomers.find(c => c.id === customer.id)) {
      setSelectedCustomers(selectedCustomers.filter(c => c.id !== customer.id));
    } else {
      setSelectedCustomers([...selectedCustomers, customer]);
    }
  };

  const handleRouteGenerated = (visits: PlannedVisit[]) => {
    setPlannedVisits(visits);
  };

  const createTripPlan = () => {
    // Here you would typically save the trip plan
    console.log('Creating trip plan with visits:', plannedVisits);
    setIsCreateTripOpen(false);
    // Reset form
    setSelectedCustomers([]);
    setPlannedVisits([]);
  };

  const totalDistance = plannedVisits.reduce((sum, visit) => sum + visit.distance, 0);
  const totalTime = plannedVisits.reduce((sum, visit) => sum + visit.travelTime + visit.estimatedDuration, 0);
  const totalPotential = selectedCustomers.reduce((sum, customer) => sum + customer.potentialValue, 0);

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Trip Planner</h1>
            <p className="text-gray-600 mt-1">Plan efficient routes and maximize customer visits</p>
          </div>
          <button
            onClick={() => setIsCreateTripOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Plan New Trip
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled Visits</p>
                <p className="text-2xl font-bold text-gray-900">{activities.filter(a => a.type === 'visit').length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Potential</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(customers.reduce((sum, c) => sum + c.potentialValue, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Campaigns */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.filter(c => c.status === 'active').map((campaign) => (
              <div key={campaign.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <Badge variant="info" size="sm">{campaign.type}</Badge>
                  </div>
                  <button
                    onClick={() => setSelectedCampaign(campaign.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Plan Route
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Customers:</span>
                    <span className="font-medium">{campaign.targetCustomers.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Meetings Scheduled:</span>
                    <span className="font-medium">{campaign.metrics.meetingsScheduled}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue Generated:</span>
                    <span className="font-medium text-green-600">
                      ${(campaign.metrics.revenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(campaign.metrics.customersContacted / campaign.metrics.customersTargeted) * 100}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {campaign.metrics.customersContacted} of {campaign.metrics.customersTargeted} customers contacted
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer Map View */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Customer Locations</h2>
            <div className="flex space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="university">Universities</option>
                <option value="hospital">Hospitals</option>
                <option value="utility">Utilities</option>
                <option value="government">Government</option>
              </select>
            </div>
          </div>
          
          {/* Map Placeholder */}
          <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Interactive Map View</p>
              <p className="text-sm text-gray-500">Customer locations with route optimization</p>
            </div>
          </div>

          {/* Customer List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.location.city}, {customer.location.state}</p>
                  </div>
                  <Badge variant="neutral" size="sm">{customer.type}</Badge>
                </div>
                
                <div className="space-y-1 mb-3">
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
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCustomerSelect(customer)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedCustomers.find(c => c.id === customer.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedCustomers.find(c => c.id === customer.id) ? 'Selected' : 'Select'}
                  </button>
                  <button className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Create Trip Modal */}
      <Modal
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
        title="Plan New Trip"
        size="xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Location
              </label>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter starting address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign (Optional)
              </label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select campaign</option>
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                ))}
              </select>
            </div>

            <RouteOptimization
              startLocation={startLocation}
              selectedCustomers={selectedCustomers}
              onRouteGenerated={handleRouteGenerated}
            />
          </div>

          {/* Right Panel - Route Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Trip Summary</h3>
            
            {plannedVisits.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Route className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-blue-900">{totalDistance} miles</p>
                    <p className="text-xs text-blue-600">Total Distance</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-green-900">{Math.floor(totalTime / 60)}h {totalTime % 60}m</p>
                    <p className="text-xs text-green-600">Total Time</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-purple-900">${(totalPotential / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-purple-600">Potential Value</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Planned Visits</h4>
                  {plannedVisits.map((visit, index) => (
                    <div key={visit.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{visit.customerName}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(visit.scheduledTime).toLocaleTimeString()} • {visit.estimatedDuration}min
                        </p>
                      </div>
                      <Badge variant={visit.priority === 'high' ? 'success' : 'info'} size="sm">
                        {visit.priority}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setIsCreateTripOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createTripPlan}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Create Trip Plan
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Route className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Select customers and optimize route to see trip summary</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}