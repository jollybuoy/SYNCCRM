// src/components/Layout/Sidebar.tsx
import React from 'react';
import { 
  Home, BarChart3, Target, Users, CheckSquare, MapPin, Bell, FileText, Megaphone,
  Zap, Activity, Factory, Shield, Settings, GitBranch, LogOut   // ✅ added LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ added

interface SidebarProps {
  activePortal: 'partner' | 'admin';
  activeSection: string;
  onSectionChange: (section: string) => void;
  onPortalChange: (portal: 'partner' | 'admin') => void;
}

const partnerSections = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'opportunities', label: 'Opportunities', icon: Target },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'activities', label: 'Activities', icon: CheckSquare },
  { id: 'trip-planner', label: 'Trip Planner', icon: MapPin },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'reports', label: 'Reports', icon: FileText }
];

const adminSections = [
  { id: 'integrations', label: 'Integrations', icon: Zap },
  { id: 'sync-activity', label: 'Sync Activity', icon: Activity },
  { id: 'manufacturers', label: 'Manufacturers', icon: Factory },
  { id: 'partners-rbac', label: 'Partners & RBAC', icon: Shield },
  { id: 'field-mapping', label: 'Field Mapping', icon: GitBranch },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ activePortal, activeSection, onSectionChange, onPortalChange }: SidebarProps) {
  const sections = activePortal === 'partner' ? partnerSections : adminSections;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">SynkCRM</span>
        </div>
      </div>

      {/* Portal Switcher */}
      <div className="px-4 mb-4">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => onPortalChange('partner')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activePortal === 'partner'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Partner Portal
          </button>
          <button
            onClick={() => onPortalChange('admin')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activePortal === 'admin'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admin Portal
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {section.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {/* ✅ New logout button */}
        <Link
          to="/logout"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </Link>

        <div className="mt-3 text-xs text-gray-500">
          SynkCRM v2.1.0
        </div>
      </div>
    </div>
  );
}
