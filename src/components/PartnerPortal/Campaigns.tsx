// SYNCCRM/src/components/PartnerPortal/Campaigns.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Target, Users, Calendar, TrendingUp, Filter, X, Pencil, Trash2, PhoneCall, CalendarPlus, DollarSign } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Modal from '../UI/Modal';
import Table from '../UI/Table';
import { supabase } from '../../supabaseClient';
import type { Customer } from '../../types';

type DbManufacturer = { id: number; name: string };

type CampaignRow = {
  id: number;
  name: string;
  type: string;
  status: 'draft'|'active'|'paused'|'completed';
  start_date: string;
  end_date: string;
  budget: number | null;
  description: string | null;
};

type Campaign = {
  id: number;
  name: string;
  type: string;
  status: 'draft'|'active'|'paused'|'completed';
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  metrics: {
    customersTargeted: number;
    customersContacted: number;
    meetingsScheduled: number;
    opportunitiesCreated: number; // derived from opportunities count
    revenue: number;
  };
  goals: any[];
  targetCustomers: number[];
  targetManufacturers: number[];
};

function mapDbToCampaign(row: CampaignRow, metricsMap: Record<number, any>): Campaign {
  const m = metricsMap[row.id] || { customers_targeted: 0, customers_contacted: 0, meetings_scheduled: 0, revenue: 0 };
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    budget: row.budget ?? 0,
    description: row.description ?? '',
    metrics: {
      customersTargeted: m.customers_targeted || 0,
      customersContacted: m.customers_contacted || 0,
      meetingsScheduled: m.meetings_scheduled || 0,
      opportunitiesCreated: 0, // optional: compute separately if needed
      revenue: Number(m.revenue || 0)
    },
    goals: [],
    targetCustomers: [],
    targetManufacturers: []
  };
}

/* ------------------------- Details Drawer -------------------------- */
function CampaignDetails({
  campaign,
  isOpen,
  onClose
}: {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'analytics'>('overview');
  const [mfgs, setMfgs] = useState<DbManufacturer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [scheduleCustomerId, setScheduleCustomerId] = useState<number | null>(null);
  const [revenueCustomerId, setRevenueCustomerId] = useState<number | null>(null);

  useEffect(() => {
    if (!campaign) return;
    // manufacturers
    (async () => {
      const { data, error } = await supabase
        .from('campaign_manufacturers')
        .select('manufacturer_id, manufacturers:manufacturer_id (id, name)')
        .eq('campaign_id', campaign.id);
      if (!error && data) {
        setMfgs((data as any[]).map(r => r.manufacturers).filter(Boolean));
      } else {
        setMfgs([]);
      }
    })();
  }, [campaign?.id]);

  const loadCustomers = async () => {
    if (!campaign) return;
    setLoadingCustomers(true);
    const { data, error } = await supabase
      .from('campaign_customers')
      .select(`
        customers:customer_id (
          id, name, type, city, state, potential_value
        )
      `)
      .eq('campaign_id', campaign.id);
    if (error) {
      setCustomers([]);
    } else {
      const list = (data ?? []).map((r: any) => ({
        id: r.customers.id,
        name: r.customers.name,
        type: r.customers.type,
        city: r.customers.city,
        state: r.customers.state,
        potentialValue: Number(r.customers.potential_value || 0)
      })) as Customer[];
      setCustomers(list);
    }
    setLoadingCustomers(false);
  };

  useEffect(() => {
    if (activeTab === 'customers') loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, campaign?.id]);

  if (!isOpen || !campaign) return null;

  const progressPercentage =
    campaign.metrics.customersTargeted > 0
      ? (campaign.metrics.customersContacted / campaign.metrics.customersTargeted) * 100
      : 0;

  const handleMarkContacted = async (custId: number) => {
    await supabase.from('activities').insert({
      campaign_id: campaign.id,
      customer_id: custId,
      type: 'contact',
      status: 'completed'
    });
    await loadCustomers();
  };

  const handleRemoveCustomer = async (custId: number) => {
    const ok = window.confirm('Remove this customer from the campaign?');
    if (!ok) return;
    await supabase.from('campaign_customers').delete().eq('campaign_id', campaign.id).eq('customer_id', custId);
    await loadCustomers();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-2/3 bg-white shadow-xl z-50 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{campaign.name}</h2>
            <div className="flex items-center flex-wrap gap-2 mt-2">
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
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {['overview','customers','analytics'].map((id) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === id ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {id === 'overview' ? 'Overview' : id === 'customers' ? 'Target Customers' : 'Analytics'}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPIs */}
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
                <p className="text-2xl font-bold text-orange-900">${(campaign.metrics.revenue/1_000_000).toFixed(1)}M</p>
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
                <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            {/* Manufacturers */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manufacturers</h3>
              {mfgs.length === 0
                ? <p className="text-gray-600">No manufacturers linked.</p>
                : <div className="flex flex-wrap gap-2">{mfgs.map(m => <Badge key={m.id} variant="neutral">{m.name}</Badge>)}</div>}
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
              <button
                onClick={() => setIsAddCustomerOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Customers
              </button>
            </div>

            {loadingCustomers ? (
              <p className="text-gray-600">Loading…</p>
            ) : customers.length === 0 ? (
              <p className="text-gray-600">No customers linked yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{customer.name}</h4>
                        <p className="text-sm text-gray-600">{customer.city || '-'}, {customer.state || '-'}</p>
                      </div>
                      <Badge variant="neutral" size="sm">{customer.type}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Potential Value:</span>
                        <span className="font-medium text-green-600">${((customer.potentialValue ?? 0)/1_000_000).toFixed(1)}M</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 inline-flex items-center justify-center"
                        onClick={() => handleMarkContacted(customer.id)}
                        title="Mark Contacted"
                      >
                        <PhoneCall className="h-4 w-4 mr-1" /> Contacted
                      </button>
                      <button
                        className="flex-1 px-3 py-2 text-sm font-medium text-purple-700 border border-purple-300 rounded-md hover:bg-purple-50 inline-flex items-center justify-center"
                        onClick={() => setScheduleCustomerId(customer.id)}
                        title="Schedule Meeting"
                      >
                        <CalendarPlus className="h-4 w-4 mr-1" /> Meeting
                      </button>
                      <button
                        className="flex-1 px-3 py-2 text-sm font-medium text-emerald-700 border border-emerald-300 rounded-md hover:bg-emerald-50 inline-flex items-center justify-center"
                        onClick={() => setRevenueCustomerId(customer.id)}
                        title="Log Revenue"
                      >
                        <DollarSign className="h-4 w-4 mr-1" /> Revenue
                      </button>
                      <button
                        className="px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                        onClick={() => handleRemoveCustomer(customer.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modals under the tab to keep state local */}
            <AddCustomerModal
              isOpen={isAddCustomerOpen}
              onClose={() => setIsAddCustomerOpen(false)}
              campaignId={campaign.id}
              onAdded={loadCustomers}
            />
            <ScheduleMeetingModal
              isOpen={!!scheduleCustomerId}
              onClose={() => setScheduleCustomerId(null)}
              campaignId={campaign.id}
              customerId={scheduleCustomerId || 0}
              onSaved={loadCustomers}
            />
            <LogRevenueModal
              isOpen={!!revenueCustomerId}
              onClose={() => setRevenueCustomerId(null)}
              campaignId={campaign.id}
              customerId={revenueCustomerId || 0}
              onSaved={loadCustomers}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-900">${(campaign.metrics.revenue/1_000_000).toFixed(1)}M</p>
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

/* ------------------------- Page (list, create, edit, delete) -------------------------- */
export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [dbCampaigns, setDbCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const [dbManufacturers, setDbManufacturers] = useState<DbManufacturer[]>([]);
  const [selectedManufacturerIds, setSelectedManufacturerIds] = useState<number[]>([]);

  // form
  const [name, setName] = useState('');
  const [typeVal, setTypeVal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [description, setDescription] = useState('');
  const [statusVal, setStatusVal] = useState<'draft' | 'active' | 'paused' | 'completed'>('draft');
  const [saving, setSaving] = useState(false);

  const fetchMetricsMap = async (): Promise<Record<number, any>> => {
    const { data, error } = await supabase.from('campaign_metrics').select('*');
    if (error || !data) return {};
    const map: Record<number, any> = {};
    for (const r of data) map[r.campaign_id] = r;
    return map;
  };

  const fetchCampaigns = async () => {
    setLoading(true); setLoadErr(null);
    const [{ data: rows, error }, metricsMap] = await Promise.all([
      supabase.from('campaigns').select('id,name,type,status,start_date,end_date,budget,description').order('created_at', { ascending: false }),
      fetchMetricsMap()
    ]);
    if (error) {
      setLoadErr(error.message); setDbCampaigns([]); setLoading(false); return;
    }
    setDbCampaigns((rows ?? []).map(r => mapDbToCampaign(r as CampaignRow, metricsMap)));
    setLoading(false);
  };

  const fetchManufacturers = async () => {
    const { data } = await supabase.from('manufacturers').select('id,name').order('name');
    setDbManufacturers((data ?? []) as DbManufacturer[]);
  };

  useEffect(() => { fetchCampaigns(); fetchManufacturers(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setName(''); setTypeVal(''); setStartDate(''); setEndDate('');
    setBudget(''); setDescription(''); setStatusVal('draft'); setSelectedManufacturerIds([]);
  };

  // CREATE
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !typeVal || !startDate || !endDate) return alert('Please fill Campaign Name, Type, Start Date, End Date.');
    setSaving(true);
    const payload = {
      name, type: typeVal, status: statusVal,
      start_date: startDate, end_date: endDate,
      budget: budget ? Number(budget) : null, description: description || null,
      metrics: {}, goals: [], target_customer_ids: []
    };
    const { data: newRows, error } = await supabase.from('campaigns').insert(payload).select('id').single();
    if (error || !newRows) { setSaving(false); return alert(`Failed to create: ${error?.message}`); }
    const newId = (newRows as any).id;

    if (selectedManufacturerIds.length) {
      const linkRows = selectedManufacturerIds.map(mid => ({ campaign_id: newId, manufacturer_id: mid }));
      await supabase.from('campaign_manufacturers').insert(linkRows);
    }

    setSaving(false); resetForm(); setIsNewCampaignOpen(false); fetchCampaigns();
  };

  // EDIT (prefill & update)
  const openEditModal = async (c: Campaign) => {
    setEditingId(c.id);
    setName(c.name); setTypeVal(c.type);
    setStartDate(c.startDate); setEndDate(c.endDate);
    setBudget(String(c.budget || '')); setDescription(c.description || '');
    setStatusVal(c.status);
    const { data } = await supabase.from('campaign_manufacturers').select('manufacturer_id').eq('campaign_id', c.id);
    setSelectedManufacturerIds((data ?? []).map((r: any) => r.manufacturer_id));
    setIsEditOpen(true);
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    if (!name || !typeVal || !startDate || !endDate) return alert('Please fill required fields');
    setSaving(true);
    const payload = {
      name, type: typeVal, status: statusVal,
      start_date: startDate, end_date: endDate,
      budget: budget ? Number(budget) : null, description: description || null
    };
    const { error } = await supabase.from('campaigns').update(payload).eq('id', editingId);
    if (error) { setSaving(false); return alert(`Update failed: ${error.message}`); }
    await supabase.from('campaign_manufacturers').delete().eq('campaign_id', editingId);
    if (selectedManufacturerIds.length) {
      await supabase.from('campaign_manufacturers').insert(selectedManufacturerIds.map(mid => ({ campaign_id: editingId, manufacturer_id: mid })));
    }
    setSaving(false); resetForm(); setIsEditOpen(false); fetchCampaigns();
  };

  // DELETE
  const handleDeleteCampaign = async (c: Campaign) => {
    const ok = window.confirm(`Delete campaign "${c.name}"?`);
    if (!ok) return;
    const { error } = await supabase.from('campaigns').delete().eq('id', c.id);
    if (error) return alert(`Delete failed: ${error.message}`);
    if (selectedCampaign?.id === c.id) setIsDetailsOpen(false);
    fetchCampaigns();
  };

  // list filters
  const filteredCampaigns = useMemo(() => {
    return dbCampaigns.filter(c => (filterStatus === 'all' || c.status === filterStatus) && (filterType === 'all' || c.type === filterType));
  }, [dbCampaigns, filterStatus, filterType]);

  const openDetails = (c: Campaign) => { setSelectedCampaign(c); setIsDetailsOpen(true); };

  const columns = [
    {
      key: 'name',
      label: 'Campaign Name',
      render: (_: string, c: Campaign) => (
        <div>
          <div className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">{c.name}</div>
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
        <Badge variant={value === 'active' ? 'success' : value === 'paused' ? 'warning' : value === 'completed' ? 'info' : 'neutral'}>
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
            <div className="bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-600 mt-1">{Math.round(progress)}%</p>
          </div>
        );
      }
    },
    {
      key: 'metrics2',
      label: 'Revenue',
      render: (_: any, c: Campaign) => <span className="font-medium text-green-600">${(c.metrics.revenue/1_000_000).toFixed(1)}M</span>
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (_: string, c: Campaign) => <span className="text-gray-900">{new Date(c.endDate).toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, c: Campaign) => (
        <div className="flex items-center gap-2">
          <button className="p-1 rounded hover:bg-blue-50 text-blue-600" title="Edit" onClick={(e)=>{e.stopPropagation(); openEditModal(c);}}>
            <Pencil className="h-4 w-4" />
          </button>
          <button className="p-1 rounded hover:bg-red-50 text-red-600" title="Delete" onClick={(e)=>{e.stopPropagation(); handleDeleteCampaign(c);}}>
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
          <button onClick={() => { resetForm(); setIsNewCampaignOpen(true); }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> New Campaign
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
                    {(dbCampaigns.reduce((s, c) => s + (c.metrics.revenue || 0), 0)/1_000_000).toFixed(1)}M
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
              <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Status</option>
                <option value="draft">Draft</option><option value="active">Active</option>
                <option value="paused">Paused</option><option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={filterType} onChange={(e)=>setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Types</option>
                <option value="university">University</option><option value="hospital">Hospital</option>
                <option value="government">Government</option><option value="location">Location</option>
                <option value="industry">Industry</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Filter className="mr-2 h-4 w-4" /> Apply Filters
              </button>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card padding="sm">
          <Table columns={columns} data={filteredCampaigns} onRowClick={openDetails} />
        </Card>
      </div>

      {/* Drawer */}
      <CampaignDetails campaign={selectedCampaign} isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} />

      {/* Create */}
      <Modal isOpen={isNewCampaignOpen} onClose={()=>setIsNewCampaignOpen(false)} title="Create New Campaign" size="lg">
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
            selectedManufacturerIds={selectedManufacturerIds} setSelectedManufacturerIds={setSelectedManufacturerIds}
            saving={saving}
          />
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={()=>setIsNewCampaignOpen(false)} disabled={saving}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60" disabled={saving}>
              {saving ? 'Creating…' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit */}
      <Modal isOpen={isEditOpen} onClose={()=>setIsEditOpen(false)} title="Edit Campaign" size="lg">
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
            selectedManufacturerIds={selectedManufacturerIds} setSelectedManufacturerIds={setSelectedManufacturerIds}
            saving={saving}
          />
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={()=>setIsEditOpen(false)} disabled={saving}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

/* ---------- Reusable subform ---------- */
function CampaignFormFields(props: {
  dbManufacturers: DbManufacturer[];
  name: string; setName: (v: string)=>void;
  typeVal: string; setTypeVal: (v: string)=>void;
  startDate: string; setStartDate: (v: string)=>void;
  endDate: string; setEndDate: (v: string)=>void;
  budget: string; setBudget: (v: string)=>void;
  description: string; setDescription: (v: string)=>void;
  statusVal: 'draft'|'active'|'paused'|'completed'; setStatusVal: (v: any)=>void;
  selectedManufacturerIds: number[]; setSelectedManufacturerIds: (updater: any)=>void;
  saving: boolean;
}) {
  const { dbManufacturers, name, setName, typeVal, setTypeVal, startDate, setStartDate, endDate, setEndDate, budget, setBudget, description, setDescription, statusVal, setStatusVal, selectedManufacturerIds, setSelectedManufacturerIds, saving } = props;
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Name *</label>
          <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name} onChange={(e)=>setName(e.target.value)} disabled={saving} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Type *</label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeVal} onChange={(e)=>setTypeVal(e.target.value)} disabled={saving}>
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
          <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate} onChange={(e)=>setStartDate(e.target.value)} disabled={saving} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date *</label>
          <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate} onChange={(e)=>setEndDate(e.target.value)} disabled={saving} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusVal} onChange={(e)=>setStatusVal(e.target.value)} disabled={saving}>
          <option value="draft">Draft</option><option value="active">Active</option>
          <option value="paused">Paused</option><option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Target Manufacturers</label>
        <div className="mt-2 space-y-2">
          {dbManufacturers.map((m)=>(
            <label key={m.id} className="inline-flex items-center mr-6">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600"
                checked={selectedManufacturerIds.includes(m.id)}
                onChange={(e)=>setSelectedManufacturerIds((prev:number[]) => e.target.checked ? [...prev, m.id] : prev.filter(id => id !== m.id))}
                disabled={saving} />
              <span className="ml-2 text-sm text-gray-700">{m.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Budget (Optional)</label>
        <input type="number" min="0" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={budget} onChange={(e)=>setBudget(e.target.value)} disabled={saving} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea rows={3} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={description} onChange={(e)=>setDescription(e.target.value)} disabled={saving} />
      </div>
    </>
  );
}

/* ---------- Add Customer Modal ---------- */
function AddCustomerModal({
  isOpen, onClose, campaignId, onAdded
}: { isOpen: boolean; onClose: () => void; campaignId: number; onAdded: () => void; }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'university'|'hospital'|'government'|'industry'|'other'>('other');
  const [city, setCity] = useState(''); const [state, setState] = useState('');
  const [potential, setPotential] = useState<string>('0');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!isOpen) { setName(''); setType('other'); setCity(''); setState(''); setPotential('0'); setSaving(false);} }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert('Customer name is required');
    setSaving(true);
    const { data: cust, error } = await supabase.from('customers').insert({
      name, type, city, state, potential_value: potential ? Number(potential) : 0
    }).select('id').single();
    if (error || !cust) { setSaving(false); return alert(`Create failed: ${error?.message}`); }
    await supabase.from('campaign_customers').insert({ campaign_id: campaignId, customer_id: (cust as any).id });
    setSaving(false); onClose(); onAdded();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Customer to Campaign" size="md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={name} onChange={e=>setName(e.target.value)} disabled={saving} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={type} onChange={e=>setType(e.target.value as any)} disabled={saving}>
              <option value="university">University</option>
              <option value="hospital">Hospital</option>
              <option value="government">Government</option>
              <option value="industry">Industry</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Potential Value</label>
            <input type="number" min="0" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={potential} onChange={e=>setPotential(e.target.value)} disabled={saving} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={city} onChange={e=>setCity(e.target.value)} disabled={saving} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" value={state} onChange={e=>setState(e.target.value)} disabled={saving} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm" disabled={saving}>{saving ? 'Adding…' : 'Add'}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- Schedule Meeting Modal ---------- */
function ScheduleMeetingModal({
  isOpen, onClose, campaignId, customerId, onSaved
}: { isOpen: boolean; onClose: () => void; campaignId: number; customerId: number; onSaved: () => void; }) {
  const [date, setDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (!isOpen) { setDate(''); setNotes(''); setSaving(false);} }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('activities').insert({
      campaign_id: campaignId,
      customer_id: customerId,
      type: 'meeting',
      status: 'scheduled',
      occurred_at: date || new Date().toISOString(),
      notes
    });
    setSaving(false); onClose(); onSaved();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Meeting" size="sm">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date & Time</label>
          <input type="datetime-local" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={date} onChange={e=>setDate(e.target.value)} disabled={saving} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea rows={3} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={notes} onChange={e=>setNotes(e.target.value)} disabled={saving} />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm" disabled={saving}>{saving ? 'Saving…' : 'Schedule'}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- Log Revenue Modal ---------- */
function LogRevenueModal({
  isOpen, onClose, campaignId, customerId, onSaved
}: { isOpen: boolean; onClose: () => void; campaignId: number; customerId: number; onSaved: () => void; }) {
  const [amount, setAmount] = useState<string>('0');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (!isOpen) { setAmount('0'); setSaving(false);} }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('opportunities').insert({
      campaign_id: campaignId,
      customer_id: customerId,
      amount: Number(amount || 0),
      stage: 'closed_won',
      closed_at: new Date().toISOString()
    });
    setSaving(false); onClose(); onSaved();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Revenue (Closed Won)" size="sm">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
          <input type="number" min="0" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={amount} onChange={e=>setAmount(e.target.value)} disabled={saving} />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-sm" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm" disabled={saving}>{saving ? 'Saving…' : 'Log Revenue'}</button>
        </div>
      </form>
    </Modal>
  );
}
