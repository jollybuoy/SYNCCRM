// SYNCCRM/src/components/PartnerPortal/Campaigns.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Target, Users, Calendar, TrendingUp, Filter, X, Pencil, Trash2 } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Modal from '../UI/Modal';
import Table from '../UI/Table';
import { customers } from '../../data/sampleData';
import { Campaign, Customer } from '../../types';
import { supabase } from '../../supabaseClient';

type DbManufacturer = { id: number; name: string };

interface CampaignDetailsProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

function CampaignDetails({ campaign, isOpen, onClose }: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [mfgs, setMfgs] = useState<DbManufacturer[]>([]);
  const [loadingMfg, setLoadingMfg] = useState(false);

  useEffect(() => {
    async function fetchMfg() {
      if (!campaign) return;
      setLoadingMfg(true);
      // fetch manufacturers linked to this campaign
      const { data, error } = await supabase
        .from('campaign_manufacturers')
        .select('manufacturer_id, manufacturers:manufacturer_id (id, name)')
        .eq('campaign_id', campaign.id);
      if (!error && data) {
        const mapped: DbManufacturer[] =
          (data as any[]).map(r => r.manufacturers).filter(Boolean);
        setMfgs(mapped);
      } else {
        setMfgs([]);
      }
      setLoadingMfg(false);
    }
    fetchMfg();
  }, [campaign?.id]);

  if (!isOpen || !campaign) return null;

  const targetCustomers = customers.filter(c => campaign.targetCustomers.includes(c.id));
  const progressPercentage =
    campaign.metrics.customersTargeted > 0
      ? (campaign.metrics.customersContacted / campaign.metrics.customersTargeted) * 100
      : 0;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-2/3 bg-white shadow-xl z-50 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{campaign.name}</h2>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <Badge
                variant={
                  campaign.status === 'active'
                    ? 'success'
                    : campaign.status === 'paused'
                    ? 'warning'
                    : campaign.status === 'completed'
                    ? 'info'
                    : 'neutral'
                }
              >
                {campaign.status}
              </Badge>
              <Badge variant="neutral">{campaign.type}</Badge>
              <span className="text-sm text-gray-600">
                {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                {new Date(campaign.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'customers', label: 'Target Customers' },
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
                <p className="text-2xl font-bold text-orange-900">
                  ${(campaign.metrics.revenue / 1_000_000).toFixed(1)}M
                </p>
                <p className="text-sm text-orange-600">Revenue Generated</p>
              </div>
            </div>

            {/* Linked Manufacturers */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manufacturers</h3>
              {loadingMfg ? (
                <p className="text-gray-600">Loading…</p>
              ) : mfgs.length === 0 ? (
                <p className="text-gray-600">No manufacturers linked.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {mfgs.map(m => (
                    <Badge key={m.id} variant="neutral">{m.name}</Badge>
                  ))}
                </div>
              )}
            </div>

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
              {targetCustomers.map((customer: Customer) => (
                <div key={customer.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{customer.name}</h4>
                      <p className="text-sm text-gray-600">
                        {customer.location.city}, {customer.location.state}
                      </p>
                    </div>
                    <Badge variant="neutral" size="sm">{customer.type}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Potential Value:</span>
                      <span className="font-medium text-green-600">
                        ${(customer.potentialValue / 1_000_000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Contact:</span>
                      <span className="text-gray-900">
                        {customer.lastInteraction ? new Date(customer.lastInteraction).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-900">
                  ${(campaign.metrics.revenue / 1_000_000).toFixed(1)}M
                </p>
                <p className="text-sm text-green-600">Revenue Generated</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-900">
                  ${(campaign.budget || 0).toLocaleString()}
                </p>
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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Live data
  const [dbCampaigns, setDbCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  // Manufacturers
  const [dbManufacturers, setDbManufacturers] = useState<DbManufacturer[]>([]);
  const [selectedManufacturerIds, setSelectedManufacturerIds] = useState<number[]>([]);

  // Create/Edit form state
  const [name, setName] = useState('');
  const [typeVal, setTypeVal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [description, setDescription] = useState('');
  const [statusVal, setStatusVal] = useState<'draft' | 'active' | 'paused' | 'completed'>('draft');

  const [saving, setSaving] = useState(false);

  function mapDbToCampaign(row: any): Campaign {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      status: row.status,
      startDate: row.start_date,
      endDate: row.end_date,
      budget: row.budget ?? 0,
      description: row.description ?? '',
      metrics:
        row.metrics ?? {
          customersTargeted: 0,
          customersContacted: 0,
          meetingsScheduled: 0,
          opportunitiesCreated: 0,
          revenue: 0
        },
      goals: row.goals ?? [],
      targetCustomers: (row.target_customer_ids ?? []) as number[],
      targetManufacturers: []
    };
  }

  async function fetchCampaigns() {
    setLoading(true); setLoadErr(null);
    const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
    if (error) { setLoadErr(error.message); setDbCampaigns([]); }
    else { setDbCampaigns((data ?? []).map(mapDbToCampaign)); }
    setLoading(false);
  }

  async function fetchManufacturers() {
    const { data, error } = await supabase.from('manufacturers').select('id,name').order('name');
    if (!error && data) setDbManufacturers(data as DbManufacturer[]);
  }

  useEffect(() => { fetchCampaigns(); fetchManufacturers(); }, []);

  // ---------- CREATE ----------
  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !typeVal || !startDate || !endDate) {
      alert('Please fill Campaign Name, Type, Start Date, End Date.');
      return;
    }
    setSaving(true);

    const payload = {
      name,
      type: typeVal,
      status: statusVal,
      start_date: startDate,
      end_date: endDate,
      budget: budget ? Number(budget) : null,
      description: description || null,
      metrics: { customersTargeted: 0, customersContacted: 0, meetingsScheduled: 0, opportunitiesCreated: 0, revenue: 0 },
      goals: [],
      target_customer_ids: []
    };

    const { data: newRows, error: insertErr } = await supabase
      .from('campaigns')
      .insert(payload)
      .select('id')
      .single();

    if (insertErr || !newRows) {
      setSaving(false);
      alert(`Failed to create: ${insertErr?.message ?? 'unknown error'}`);
      return;
    }
    const newCampaignId = (newRows as { id: number }).id;

    // link manufacturers
    if (selectedManufacturerIds.length > 0) {
      const linkRows = selectedManufacturerIds.map((mid) => ({ campaign_id: newCampaignId, manufacturer_id: mid }));
      const { error: linkErr } = await supabase.from('campaign_manufacturers').insert(linkRows);
      if (linkErr) alert(`Campaign created, but linking manufacturers failed: ${linkErr.message}`);
    }

    setSaving(false);
    resetForm();
    setIsNewCampaignOpen(false);
    fetchCampaigns();
  }

  // ---------- EDIT ----------
  async function openEditModal(campaign: Campaign) {
    setEditingId(campaign.id);
    setName(campaign.name);
    setTypeVal(campaign.type);
    setStartDate(campaign.startDate);
    setEndDate(campaign.endDate);
    setBudget(String(campaign.budget || ''));
    setDescription(campaign.description || '');
    setStatusVal((campaign.status as any) ?? 'draft');
    // load linked manufacturers
    const { data } = await supabase
      .from('campaign_manufacturers')
      .select('manufacturer_id')
      .eq('campaign_id', campaign.id);
    setSelectedManufacturerIds((data ?? []).map((r: any) => r.manufacturer_id));
    setIsEditOpen(true);
  }

  async function handleUpdateCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    if (!name || !typeVal || !startDate || !endDate) {
      alert('Please fill Campaign Name, Type, Start Date, End Date.');
      return;
    }
    setSaving(true);

    const payload = {
      name,
      type: typeVal,
      status: statusVal,
      start_date: startDate,
      end_date: endDate,
      budget: budget ? Number(budget) : null,
      description: description || null
    };

    const { error: upErr } = await supabase.from('campaigns').update(payload).eq('id', editingId);
    if (upErr) {
      setSaving(false);
      alert(`Update failed: ${upErr.message}`);
      return;
    }

    // relink manufacturers: delete old, insert new
    await supabase.from('campaign_manufacturers').delete().eq('campaign_id', editingId);
    if (selectedManufacturerIds.length > 0) {
      const rows = selectedManufacturerIds.map(mid => ({ campaign_id: editingId, manufacturer_id: mid }));
      const { error: linkErr } = await supabase.from('campaign_manufacturers').insert(rows);
      if (linkErr) alert(`Updated campaign, but relinking manufacturers failed: ${linkErr.message}`);
    }

    setSaving(false);
    resetForm();
    setIsEditOpen(false);
    fetchCampaigns();
  }

  // ---------- DELETE ----------
  async function handleDeleteCampaign(campaign: Campaign) {
    const ok = window.confirm(`Delete campaign "${campaign.name}"? This cannot be undone.`);
    if (!ok) return;
    const { error } = await supabase.from('campaigns').delete().eq('id', campaign.id);
    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }
    if (selectedCampaign?.id === campaign.id) setIsDetailsOpen(false);
    fetchCampaigns();
  }

  function resetForm() {
    setEditingId(null);
    setName(''); setTypeVal(''); setStartDate(''); setEndDate('');
    setBudget(''); setDescription(''); setStatusVal('draft'); setSelectedManufacturerIds([]);
  }

  const filteredCampaigns = dbCampaigns.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterType !== 'all' && c.type !== filterType) return false;
    return true;
  });

  const handleViewDetails = (campaign: Campaign) => { setSelectedCampaign(campaign); setIsDetailsOpen(true); };

  const columns = [
    {
      key: 'name',
      label: 'Campaign Name',
      render: (value: string, c: Campaign) => (
        <div>
          <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">{value}</div>
          <div className="text-sm text-gray-500">{(c.description || '').substring(0, 60)}...</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => <Badge variant="neutral" size="sm">{value}</Badge>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={value === 'active' ? 'success' : value === 'paused' ? 'warning' : value === 'completed' ? 'info' : 'neutral'}
        >
          {value}
        </Badge>
      )
    },
    {
      key: 'metrics',
      label: 'Progress',
      render: (_: any, c: Campaign) => {
        const progress = c.metrics.customersTargeted ? (c.metrics.customersContacted / c.metrics.customersTargeted) * 100 : 0;
        return (
          <div className="w-24">
            <div className="bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
            <p className="text-xs text-gray-600 mt-1">{Math.round(progress)}%</p>
          </div>
        );
      }
    },
    {
      key: 'targetCustomers',
      label: 'Customers',
      render: (value: number[]) => <span className="text-gray-900">{value.length}</span>
    },
    {
      key: 'metrics',
      label: 'Revenue',
      render: (v: any) => <span className="font-medium text-green-600">${(v.revenue / 1_000_000).toFixed(1)}M</span>
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (value: string) => <span className="text-gray-900">{new Date(value).toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, c: Campaign) => (
        <div className="flex items-center gap-2">
          <button
            className="p-1 rounded hover:bg-blue-50 text-blue-600"
            onClick={(e) => { e.stopPropagation(); openEditModal(c); }}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="p-1 rounded hover:bg-red-50 text-red-600"
            onClick={(e) => { e.stopPropagation(); handleDeleteCampaign(c); }}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
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
            onClick={() => { resetForm(); setIsNewCampaignOpen(true); }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </button>
        </div>

        {/* Loading / Error */}
        {loading && <Card><div className="py-6 text-gray-600">Loading campaigns…</div></Card>}
        {loadErr && <Card><div className="py-6 text-red-600">Error loading campaigns: {loadErr}</div></Card>}

        {/* Stats */}
        {!loading && !loadErr && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100"><Target className="h-6 w-6 text-blue-600" /></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{dbCampaigns.filter(c => c.status === 'active').length}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100"><Users className="h-6 w-6 text-green-600" /></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Customers Targeted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dbCampaigns.reduce((s, c) => s + (c.metrics.customersTargeted || 0), 0)}
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100"><Calendar className="h-6 w-6 text-purple-600" /></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Meetings Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dbCampaigns.reduce((s, c) => s + (c.metrics.meetingsScheduled || 0), 0)}
                  </p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100"><TrendingUp className="h-6 w-6 text-orange-600" /></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(dbCampaigns.reduce((s, c) => s + (c.metrics.revenue || 0), 0) / 1_000_000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
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
          <Table columns={columns} data={filteredCampaigns} onRowClick={handleViewDetails} />
        </Card>
      </div>

      {/* Details Drawer */}
      <CampaignDetails campaign={selectedCampaign} isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} />

      {/* CREATE Modal */}
      <Modal isOpen={isNewCampaignOpen} onClose={() => setIsNewCampaignOpen(false)} title="Create New Campaign" size="lg">
        <form className="space-y-4" onSubmit={handleCreateCampaign}>
          <CampaignFormFields
            dbManufacturers={dbManufacturers}
            name={name} setName={setName}
            typeVal={typeVal} setTypeVal={setTypeVal}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            budget={budget} setBudget={setBudget}
            description={description} setDescription={setDescription}
            statusVal={statusVal} setStatusVal={setStatusVal}
            selectedManufacturerIds={selectedManufacturerIds}
            setSelectedManufacturerIds={setSelectedManufacturerIds}
            saving={saving}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsNewCampaignOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" disabled={saving}>
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              disabled={saving}>
              {saving ? 'Creating…' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Campaign" size="lg">
        <form className="space-y-4" onSubmit={handleUpdateCampaign}>
          <CampaignFormFields
            dbManufacturers={dbManufacturers}
            name={name} setName={setName}
            typeVal={typeVal} setTypeVal={setTypeVal}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            budget={budget} setBudget={setBudget}
            description={description} setDescription={setDescription}
            statusVal={statusVal} setStatusVal={setStatusVal}
            selectedManufacturerIds={selectedManufacturerIds}
            setSelectedManufacturerIds={setSelectedManufacturerIds}
            saving={saving}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" disabled={saving}>
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

/** Small presentational component to keep modals tidy */
function CampaignFormFields(props: {
  dbManufacturers: DbManufacturer[];
  name: string; setName: (v: string) => void;
  typeVal: string; setTypeVal: (v: string) => void;
  startDate: string; setStartDate: (v: string) => void;
  endDate: string; setEndDate: (v: string) => void;
  budget: string; setBudget: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  statusVal: 'draft' | 'active' | 'paused' | 'completed'; setStatusVal: (v: any) => void;
  selectedManufacturerIds: number[]; setSelectedManufacturerIds: (updater: any) => void;
  saving: boolean;
}) {
  const {
    dbManufacturers, name, setName, typeVal, setTypeVal, startDate, setStartDate, endDate, setEndDate,
    budget, setBudget, description, setDescription, statusVal, setStatusVal,
    selectedManufacturerIds, setSelectedManufacturerIds, saving
  } = props;

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Name *</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter campaign name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Type *</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeVal}
            onChange={(e) => setTypeVal(e.target.value)}
            disabled={saving}
          >
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
          <label className="block text-sm font-medium text-gray-700">Start Date *</label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={saving}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date *</label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={saving}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusVal}
          onChange={(e) => setStatusVal(e.target.value as any)}
          disabled={saving}
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Target Manufacturers</label>
        <div className="mt-2 space-y-2">
          {dbManufacturers.map((m) => (
            <label key={m.id} className="inline-flex items-center mr-6">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={selectedManufacturerIds.includes(m.id)}
                onChange={(e) => {
                  setSelectedManufacturerIds((prev: number[]) =>
                    e.target.checked ? [...prev, m.id] : prev.filter((id) => id !== m.id)
                  );
                }}
                disabled={saving}
              />
              <span className="ml-2 text-sm text-gray-700">{m.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Budget (Optional)</label>
        <input
          type="number"
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          disabled={saving}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the campaign objectives and strategy..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={saving}
        />
      </div>
    </>
  );
}
