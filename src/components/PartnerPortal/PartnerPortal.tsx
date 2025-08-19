import React, { useState } from 'react';
import FuturisticSidebar from '../Layout/FuturisticSidebar';
import FuturisticTopBar from '../Layout/FuturisticTopBar';

// Enhanced Components
import FuturisticHome from './FuturisticHome';
import EnhancedDashboard from './EnhancedDashboard';
import Opportunities from './Opportunities';
import TripPlanner from './TripPlanner';
import Campaigns from './Campaigns';
import AdvancedReports from './AdvancedReports';

// Placeholder components for remaining sections
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="flex items-center justify-center h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400">Advanced AI features coming soon</p>
      </div>
    </div>
  </div>
);

export default function PartnerPortal() {
  const [activeSection, setActiveSection] = useState('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <FuturisticHome />;
      case 'dashboard':
        return <EnhancedDashboard />;
      case 'opportunities':
        return <Opportunities />;
      case 'customers':
        return <PlaceholderComponent title="Customer Intelligence" />;
      case 'campaigns':
        return <Campaigns />;
      case 'activities':
        return <PlaceholderComponent title="Activity Management" />;
      case 'trip-planner':
        return <TripPlanner />;
      case 'notifications':
        return <PlaceholderComponent title="Smart Notifications" />;
      case 'reports':
        return <AdvancedReports />;
      case 'ai-insights':
        return <PlaceholderComponent title="AI Insights Hub" />;
      default:
        return <FuturisticHome />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <FuturisticSidebar
        activePortal="partner"
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