export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'salesperson' | 'manager' | 'support' | 'admin';
  avatar?: string;
  partnerId?: string;
  territory?: string;
  phone?: string;
  lastLogin?: string;
}

export interface Partner {
  id: string;
  name: string;
  users: User[];
  assignedManufacturers: string[];
  territory: string[];
  contractStartDate: string;
  contractEndDate: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  logo: string;
  industry: string;
  crm: 'salesforce' | 'hubspot' | 'zoho' | 'dynamics';
  status: 'connected' | 'error' | 'pending' | 'syncing';
  lastSync?: string;
  apiEndpoint?: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  dataMapping: Record<string, string>;
}

export interface Customer {
  id: string;
  name: string;
  type: 'university' | 'hospital' | 'government' | 'enterprise' | 'utility' | 'industrial';
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  contacts: Contact[];
  revenue?: number;
  employees?: number;
  industry: string;
  tags: string[];
  lastInteraction?: string;
  potentialValue: number;
  visitHistory: Visit[];
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  customerId: string;
}

export interface Visit {
  id: string;
  customerId: string;
  repId: string;
  date: string;
  duration: number;
  outcome: 'successful' | 'follow_up_needed' | 'no_interest' | 'proposal_requested';
  notes: string;
  nextSteps?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  manufacturerId: string;
  manufacturerName: string;
  customerId: string;
  customerName: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'contract' | 'won' | 'lost';
  amount: number;
  closeDate: string;
  lastActivity: string;
  syncStatus: 'synced' | 'pending' | 'error' | 'queued';
  syncPhase: 'draft' | 'validation' | 'approval' | 'sync' | 'confirmed';
  probability: number;
  endUser?: string;
  consultant?: string;
  region: string;
  description?: string;
  products: string[];
  competitors?: string[];
  decisionMakers: string[];
  timeline: OpportunityTimeline[];
  attachments: Attachment[];
}

export interface OpportunityTimeline {
  id: string;
  date: string;
  stage: string;
  notes: string;
  userId: string;
  duration?: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  uploadedBy: string;
  url: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'visit' | 'email' | 'note' | 'demo' | 'proposal';
  title: string;
  description?: string;
  relatedTo: string;
  relatedType: 'customer' | 'opportunity' | 'campaign';
  dueDate?: string;
  completedDate?: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  location?: string;
  duration?: number;
  outcome?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'university' | 'hospital' | 'government' | 'location' | 'industry' | 'product';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  targetCustomers: string[];
  assignedReps: string[];
  budget?: number;
  goals: CampaignGoal[];
  metrics: CampaignMetrics;
  description: string;
  manufacturers: string[];
}

export interface CampaignGoal {
  id: string;
  description: string;
  target: number;
  achieved: number;
  unit: string;
}

export interface CampaignMetrics {
  customersTargeted: number;
  customersContacted: number;
  meetingsScheduled: number;
  opportunitiesCreated: number;
  revenue: number;
}

export interface TripPlan {
  id: string;
  name: string;
  repId: string;
  startDate: string;
  endDate: string;
  startLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  plannedVisits: PlannedVisit[];
  totalDistance: number;
  estimatedDuration: number;
  status: 'draft' | 'approved' | 'in_progress' | 'completed';
  campaignId?: string;
}

export interface PlannedVisit {
  id: string;
  customerId: string;
  customerName: string;
  scheduledTime: string;
  estimatedDuration: number;
  purpose: string;
  priority: 'low' | 'medium' | 'high';
  distance: number;
  travelTime: number;
  status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Account {
  id: string;
  name: string;
  location: string;
  contactCount: number;
  openOpportunities: number;
  lastMeeting?: string;
  latitude?: number;
  longitude?: number;
  revenue?: number;
  industry: string;
  type: string;
}

export interface Integration {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  crm: string;
  status: 'active' | 'paused' | 'error' | 'syncing';
  lastSync: string;
  apiUsageToday: number;
  errorCount: number;
  environment: 'sandbox' | 'production';
  syncPhases: SyncPhase[];
  realTimeEnabled: boolean;
}

export interface SyncPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  duration?: number;
  recordsProcessed: number;
  errors: string[];
}

export interface SyncLog {
  id: string;
  timestamp: string;
  manufacturerName: string;
  objectType: 'lead' | 'opportunity' | 'account' | 'contact';
  recordName: string;
  operation: 'create' | 'update' | 'delete';
  status: 'success' | 'failed' | 'pending';
  duration: number;
  errorMessage?: string;
  payload?: any;
  phase: string;
  retryCount: number;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'sync_error' | 'assignment' | 'system' | 'campaign' | 'opportunity';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
  relatedType?: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired: boolean;
}

export interface Dashboard {
  kpis: {
    totalOpportunities: number;
    totalRevenue: number;
    activeCampaigns: number;
    scheduledVisits: number;
    syncHealth: number;
  };
  recentActivity: Activity[];
  upcomingTasks: Activity[];
  syncStatus: Record<string, 'healthy' | 'warning' | 'error'>;
}