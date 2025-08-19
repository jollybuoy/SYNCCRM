import React, { useState } from 'react';
import FuturisticSidebar from '../Layout/FuturisticSidebar';
import FuturisticTopBar from '../Layout/FuturisticTopBar';
import FuturisticAdminHome from './FuturisticAdminHome';

// Admin Components
import Integrations from './Integrations';
import SyncActivity from './SyncActivity';

// Placeholder components for remaining sections
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="flex items-center justify-center h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400">Advanced admin features with AI-powered management</p>
      </div>
    </div>
  </div>
);

export default function AdminPortal() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <FuturisticAdminHome />;
      case 'integrations':
        return <Integrations />;
      case 'sync-activity':
        return <SyncActivity />;
      case 'manufacturers':
        return <PlaceholderComponent title="Manufacturer Management" />;
      case 'partners-rbac':
        return <PlaceholderComponent title="Partners & RBAC" />;
      case 'field-mapping':
        return <PlaceholderComponent title="AI Field Mapping" />;
      case 'analytics':
        return <PlaceholderComponent title="System Analytics" />;
      case 'ai-engine':
        return <PlaceholderComponent title="AI Engine Control" />;
      case 'settings':
        return <PlaceholderComponent title="System Settings" />;
      default:
        return <FuturisticAdminHome />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <FuturisticSidebar
        activePortal="admin"
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <FuturisticTopBar />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}