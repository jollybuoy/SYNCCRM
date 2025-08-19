import { User, Partner, Manufacturer, Opportunity, Activity, Customer, Campaign, TripPlan, Integration, SyncLog, Notification, Contact, Visit } from '../types';

export const currentUser: User = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@reppartner.com',
  role: 'salesperson',
  avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150',
  partnerId: 'rep-partners',
  territory: 'Northeast',
  phone: '+1-555-0123',
  lastLogin: '2025-01-09T08:30:00Z'
};

export const manufacturers: Manufacturer[] = [
  {
    id: 'gw-electric',
    name: 'G&W Electric',
    logo: '⚡',
    industry: 'Electrical Equipment',
    crm: 'salesforce',
    status: 'connected',
    lastSync: '2025-01-09T10:30:00Z',
    syncFrequency: 'realtime',
    dataMapping: {
      'opportunity_name': 'Name',
      'amount': 'Amount',
      'close_date': 'CloseDate'
    }
  },
  {
    id: 'ge-healthcare',
    name: 'GE Healthcare',
    logo: '🏥',
    industry: 'Healthcare Technology',
    crm: 'salesforce',
    status: 'connected',
    lastSync: '2025-01-09T09:15:00Z',
    syncFrequency: 'hourly',
    dataMapping: {
      'opportunity_name': 'Name',
      'amount': 'Amount',
      'close_date': 'CloseDate'
    }
  },
  {
    id: 'schneider',
    name: 'Schneider Electric',
    logo: '🔌',
    industry: 'Energy Management',
    crm: 'salesforce',
    status: 'syncing',
    lastSync: '2025-01-09T08:45:00Z',
    syncFrequency: 'realtime',
    dataMapping: {
      'opportunity_name': 'Name',
      'amount': 'Amount',
      'close_date': 'CloseDate'
    }
  },
  {
    id: 'siemens',
    name: 'Siemens',
    logo: '⚙️',
    industry: 'Industrial Automation',
    crm: 'salesforce',
    status: 'error',
    lastSync: '2025-01-08T16:20:00Z',
    syncFrequency: 'daily',
    dataMapping: {
      'opportunity_name': 'Name',
      'amount': 'Amount',
      'close_date': 'CloseDate'
    }
  }
];

export const customers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Massachusetts Institute of Technology',
    type: 'university',
    location: {
      address: '77 Massachusetts Ave',
      city: 'Cambridge',
      state: 'MA',
      country: 'USA',
      latitude: 42.3601,
      longitude: -71.0942
    },
    contacts: [
      {
        id: 'contact-1',
        firstName: 'Dr. Robert',
        lastName: 'Chen',
        title: 'Director of Facilities',
        email: 'r.chen@mit.edu',
        phone: '+1-617-555-0101',
        isPrimary: true,
        customerId: 'cust-1'
      }
    ],
    revenue: 50000000,
    employees: 11000,
    industry: 'Education',
    tags: ['tier-1', 'research', 'high-value'],
    lastInteraction: '2025-01-05T14:30:00Z',
    potentialValue: 2500000,
    visitHistory: []
  },
  {
    id: 'cust-2',
    name: 'Johns Hopkins Hospital',
    type: 'hospital',
    location: {
      address: '1800 Orleans St',
      city: 'Baltimore',
      state: 'MD',
      country: 'USA',
      latitude: 39.2970,
      longitude: -76.5929
    },
    contacts: [
      {
        id: 'contact-2',
        firstName: 'Maria',
        lastName: 'Rodriguez',
        title: 'Chief Technology Officer',
        email: 'm.rodriguez@jhmi.edu',
        phone: '+1-410-555-0202',
        isPrimary: true,
        customerId: 'cust-2'
      }
    ],
    revenue: 8000000000,
    employees: 35000,
    industry: 'Healthcare',
    tags: ['tier-1', 'healthcare', 'critical-infrastructure'],
    lastInteraction: '2025-01-08T11:15:00Z',
    potentialValue: 5000000,
    visitHistory: []
  },
  {
    id: 'cust-3',
    name: 'Con Edison',
    type: 'utility',
    location: {
      address: '4 Irving Pl',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      latitude: 40.7359,
      longitude: -73.9911
    },
    contacts: [
      {
        id: 'contact-3',
        firstName: 'James',
        lastName: 'Wilson',
        title: 'VP of Grid Operations',
        email: 'j.wilson@coned.com',
        phone: '+1-212-555-0303',
        isPrimary: true,
        customerId: 'cust-3'
      }
    ],
    revenue: 13000000000,
    employees: 14000,
    industry: 'Utilities',
    tags: ['tier-1', 'utility', 'grid-modernization'],
    lastInteraction: '2025-01-07T16:45:00Z',
    potentialValue: 8000000,
    visitHistory: []
  },
  {
    id: 'cust-4',
    name: 'Harvard University',
    type: 'university',
    location: {
      address: 'Massachusetts Hall',
      city: 'Cambridge',
      state: 'MA',
      country: 'USA',
      latitude: 42.3744,
      longitude: -71.1169
    },
    contacts: [
      {
        id: 'contact-4',
        firstName: 'Dr. Emily',
        lastName: 'Thompson',
        title: 'Associate Dean of Operations',
        email: 'e.thompson@harvard.edu',
        phone: '+1-617-555-0404',
        isPrimary: true,
        customerId: 'cust-4'
      }
    ],
    revenue: 5000000000,
    employees: 17000,
    industry: 'Education',
    tags: ['tier-1', 'ivy-league', 'research'],
    lastInteraction: '2025-01-06T09:30:00Z',
    potentialValue: 1800000,
    visitHistory: []
  }
];

export const campaigns: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Northeast University Infrastructure Upgrade',
    type: 'university',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    targetCustomers: ['cust-1', 'cust-4'],
    assignedReps: ['1'],
    budget: 50000,
    goals: [
      {
        id: 'goal-1',
        description: 'Schedule facility assessments',
        target: 10,
        achieved: 6,
        unit: 'visits'
      },
      {
        id: 'goal-2',
        description: 'Generate qualified opportunities',
        target: 5,
        achieved: 3,
        unit: 'opportunities'
      }
    ],
    metrics: {
      customersTargeted: 15,
      customersContacted: 12,
      meetingsScheduled: 8,
      opportunitiesCreated: 3,
      revenue: 4300000
    },
    description: 'Targeting major universities in the Northeast for electrical infrastructure upgrades and modernization projects.',
    manufacturers: ['gw-electric', 'schneider']
  },
  {
    id: 'camp-2',
    name: 'Healthcare Digital Transformation',
    type: 'hospital',
    status: 'active',
    startDate: '2025-01-15',
    endDate: '2025-09-15',
    targetCustomers: ['cust-2'],
    assignedReps: ['1'],
    budget: 75000,
    goals: [
      {
        id: 'goal-3',
        description: 'Technology assessments completed',
        target: 8,
        achieved: 2,
        unit: 'assessments'
      }
    ],
    metrics: {
      customersTargeted: 12,
      customersContacted: 8,
      meetingsScheduled: 5,
      opportunitiesCreated: 2,
      revenue: 7200000
    },
    description: 'Focus on healthcare facilities looking to upgrade their medical equipment and infrastructure.',
    manufacturers: ['ge-healthcare', 'siemens']
  }
];

export const opportunities: Opportunity[] = [
  {
    id: 'opp-1',
    name: 'MIT Campus Grid Modernization Project',
    manufacturerId: 'gw-electric',
    manufacturerName: 'G&W Electric',
    customerId: 'cust-1',
    customerName: 'Massachusetts Institute of Technology',
    stage: 'proposal',
    amount: 2800000,
    closeDate: '2025-08-15',
    lastActivity: '2025-01-08T14:30:00Z',
    syncStatus: 'synced',
    syncPhase: 'confirmed',
    probability: 75,
    endUser: 'MIT Facilities Department',
    consultant: 'Boston Engineering Group',
    region: 'Northeast',
    description: 'Complete electrical grid modernization for MIT campus including smart switches and monitoring systems.',
    products: ['Smart Grid Switches', 'Monitoring Systems', 'Protection Relays'],
    competitors: ['ABB', 'Schneider Electric'],
    decisionMakers: ['Dr. Robert Chen', 'MIT Procurement Team'],
    timeline: [
      {
        id: 'timeline-1',
        date: '2025-01-05',
        stage: 'prospecting',
        notes: 'Initial contact made with facilities director',
        userId: '1',
        duration: 60
      },
      {
        id: 'timeline-2',
        date: '2025-01-08',
        stage: 'proposal',
        notes: 'Technical proposal submitted',
        userId: '1',
        duration: 120
      }
    ],
    attachments: []
  },
  {
    id: 'opp-2',
    name: 'Johns Hopkins Medical Equipment Upgrade',
    manufacturerId: 'ge-healthcare',
    manufacturerName: 'GE Healthcare',
    customerId: 'cust-2',
    customerName: 'Johns Hopkins Hospital',
    stage: 'negotiation',
    amount: 4500000,
    closeDate: '2025-07-30',
    lastActivity: '2025-01-09T11:00:00Z',
    syncStatus: 'pending',
    syncPhase: 'approval',
    probability: 60,
    endUser: 'Johns Hopkins Medical Center',
    consultant: 'Healthcare Solutions Inc',
    region: 'Mid-Atlantic',
    description: 'Comprehensive medical imaging equipment upgrade including MRI and CT systems.',
    products: ['MRI Systems', 'CT Scanners', 'Digital X-Ray'],
    competitors: ['Siemens Healthineers', 'Philips Healthcare'],
    decisionMakers: ['Maria Rodriguez', 'Medical Equipment Committee'],
    timeline: [
      {
        id: 'timeline-3',
        date: '2025-01-03',
        stage: 'qualification',
        notes: 'Needs assessment completed',
        userId: '1',
        duration: 180
      }
    ],
    attachments: []
  },
  {
    id: 'opp-3',
    name: 'Con Edison Grid Protection System',
    manufacturerId: 'schneider',
    manufacturerName: 'Schneider Electric',
    customerId: 'cust-3',
    customerName: 'Con Edison',
    stage: 'qualification',
    amount: 12000000,
    closeDate: '2025-12-01',
    lastActivity: '2025-01-07T16:45:00Z',
    syncStatus: 'error',
    syncPhase: 'validation',
    probability: 40,
    endUser: 'Con Edison Grid Operations',
    consultant: 'Power Systems Engineering',
    region: 'Northeast',
    description: 'Advanced grid protection and automation system for NYC electrical grid.',
    products: ['Protection Relays', 'SCADA Systems', 'Grid Automation'],
    competitors: ['GE Grid Solutions', 'ABB'],
    decisionMakers: ['James Wilson', 'Grid Operations Team'],
    timeline: [],
    attachments: []
  }
];

export const activities: Activity[] = [
  {
    id: 'act-1',
    type: 'visit',
    title: 'MIT Campus Site Assessment',
    description: 'Conduct detailed site assessment for grid modernization project',
    relatedTo: 'opp-1',
    relatedType: 'opportunity',
    dueDate: '2025-01-15',
    assignedTo: currentUser.id,
    priority: 'high',
    status: 'pending',
    location: 'MIT Campus, Cambridge, MA',
    duration: 240
  },
  {
    id: 'act-2',
    type: 'demo',
    title: 'GE Healthcare Equipment Demo',
    description: 'Product demonstration of new MRI systems',
    relatedTo: 'opp-2',
    relatedType: 'opportunity',
    dueDate: '2025-01-12',
    assignedTo: currentUser.id,
    priority: 'high',
    status: 'pending',
    location: 'Johns Hopkins Hospital, Baltimore, MD',
    duration: 180
  },
  {
    id: 'act-3',
    type: 'call',
    title: 'Harvard Facilities Follow-up',
    description: 'Follow up on infrastructure assessment proposal',
    relatedTo: 'camp-1',
    relatedType: 'campaign',
    dueDate: '2025-01-11',
    assignedTo: currentUser.id,
    priority: 'medium',
    status: 'pending',
    duration: 30
  }
];

export const integrations: Integration[] = [
  {
    id: 'int-1',
    manufacturerId: 'gw-electric',
    manufacturerName: 'G&W Electric',
    crm: 'Salesforce',
    status: 'active',
    lastSync: '2025-01-09T10:30:00Z',
    apiUsageToday: 1247,
    errorCount: 0,
    environment: 'production',
    realTimeEnabled: true,
    syncPhases: [
      {
        id: 'phase-1',
        name: 'Data Validation',
        description: 'Validate data format and required fields',
        status: 'completed',
        startTime: '2025-01-09T10:28:00Z',
        endTime: '2025-01-09T10:28:30Z',
        duration: 30000,
        recordsProcessed: 15,
        errors: []
      },
      {
        id: 'phase-2',
        name: 'Sync to Salesforce',
        description: 'Push validated data to manufacturer Salesforce',
        status: 'completed',
        startTime: '2025-01-09T10:28:30Z',
        endTime: '2025-01-09T10:30:00Z',
        duration: 90000,
        recordsProcessed: 15,
        errors: []
      }
    ]
  },
  {
    id: 'int-2',
    manufacturerId: 'ge-healthcare',
    manufacturerName: 'GE Healthcare',
    crm: 'Salesforce',
    status: 'active',
    lastSync: '2025-01-09T09:15:00Z',
    apiUsageToday: 856,
    errorCount: 2,
    environment: 'production',
    realTimeEnabled: false,
    syncPhases: [
      {
        id: 'phase-3',
        name: 'Data Validation',
        description: 'Validate data format and required fields',
        status: 'completed',
        recordsProcessed: 8,
        errors: []
      },
      {
        id: 'phase-4',
        name: 'Sync to Salesforce',
        description: 'Push validated data to manufacturer Salesforce',
        status: 'completed',
        recordsProcessed: 6,
        errors: ['Invalid contact email format', 'Missing required field: Industry']
      }
    ]
  },
  {
    id: 'int-3',
    manufacturerId: 'schneider',
    manufacturerName: 'Schneider Electric',
    crm: 'Salesforce',
    status: 'syncing',
    lastSync: '2025-01-09T08:45:00Z',
    apiUsageToday: 234,
    errorCount: 0,
    environment: 'production',
    realTimeEnabled: true,
    syncPhases: [
      {
        id: 'phase-5',
        name: 'Data Validation',
        description: 'Validate data format and required fields',
        status: 'in_progress',
        startTime: '2025-01-09T10:35:00Z',
        recordsProcessed: 3,
        errors: []
      }
    ]
  },
  {
    id: 'int-4',
    manufacturerId: 'siemens',
    manufacturerName: 'Siemens',
    crm: 'Salesforce',
    status: 'error',
    lastSync: '2025-01-08T16:20:00Z',
    apiUsageToday: 45,
    errorCount: 15,
    environment: 'production',
    realTimeEnabled: false,
    syncPhases: [
      {
        id: 'phase-6',
        name: 'Data Validation',
        description: 'Validate data format and required fields',
        status: 'failed',
        startTime: '2025-01-08T16:18:00Z',
        endTime: '2025-01-08T16:20:00Z',
        duration: 120000,
        recordsProcessed: 0,
        errors: ['Authentication failed: Invalid API token', 'Connection timeout']
      }
    ]
  }
];

export const syncLogs: SyncLog[] = [
  {
    id: 'log-1',
    timestamp: '2025-01-09T10:30:00Z',
    manufacturerName: 'G&W Electric',
    objectType: 'opportunity',
    recordName: 'MIT Campus Grid Modernization',
    operation: 'update',
    status: 'success',
    duration: 1200,
    phase: 'Sync to Salesforce',
    retryCount: 0
  },
  {
    id: 'log-2',
    timestamp: '2025-01-09T10:25:00Z',
    manufacturerName: 'GE Healthcare',
    objectType: 'contact',
    recordName: 'Maria Rodriguez',
    operation: 'create',
    status: 'success',
    duration: 850,
    phase: 'Data Validation',
    retryCount: 0
  },
  {
    id: 'log-3',
    timestamp: '2025-01-09T10:20:00Z',
    manufacturerName: 'Siemens',
    objectType: 'opportunity',
    recordName: 'Industrial Automation Project',
    operation: 'update',
    status: 'failed',
    duration: 3000,
    errorMessage: 'Authentication failed: Invalid API token. Please refresh connection.',
    phase: 'Data Validation',
    retryCount: 2
  },
  {
    id: 'log-4',
    timestamp: '2025-01-09T10:35:00Z',
    manufacturerName: 'Schneider Electric',
    objectType: 'opportunity',
    recordName: 'Con Edison Grid Protection',
    operation: 'update',
    status: 'pending',
    duration: 0,
    phase: 'Data Validation',
    retryCount: 0
  }
];

export const notifications: Notification[] = [
  {
    id: 'not-1',
    type: 'opportunity',
    title: 'High-Value Opportunity Needs Attention',
    message: 'MIT Campus Grid Modernization ($2.8M) hasn\'t been updated in 3 days',
    timestamp: '2025-01-09T09:00:00Z',
    read: false,
    relatedId: 'opp-1',
    relatedType: 'opportunity',
    priority: 'high',
    actionRequired: true
  },
  {
    id: 'not-2',
    type: 'sync_error',
    title: 'Sync Failed - Siemens Integration',
    message: 'Authentication error detected. Connection needs to be refreshed.',
    timestamp: '2025-01-09T08:45:00Z',
    read: false,
    relatedId: 'int-4',
    relatedType: 'integration',
    priority: 'high',
    actionRequired: true
  },
  {
    id: 'not-3',
    type: 'campaign',
    title: 'Campaign Milestone Achieved',
    message: 'Northeast University campaign has reached 60% of target visits',
    timestamp: '2025-01-09T08:00:00Z',
    read: true,
    relatedId: 'camp-1',
    relatedType: 'campaign',
    priority: 'medium',
    actionRequired: false
  },
  {
    id: 'not-4',
    type: 'reminder',
    title: 'Upcoming Site Visit',
    message: 'MIT Campus assessment scheduled for tomorrow at 10:00 AM',
    timestamp: '2025-01-09T07:30:00Z',
    read: false,
    relatedId: 'act-1',
    relatedType: 'activity',
    priority: 'medium',
    actionRequired: false
  }
];