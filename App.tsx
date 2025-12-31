
import React, { useState, useEffect } from 'react';
import { View, Booking, DailySlot } from './types';
import { supabaseMock } from './services/supabaseMock';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AvailabilityManager from './components/AvailabilityManager';
import ChatSimulator from './components/ChatSimulator';
import Settings from './components/Settings';
import Logs from './components/Logs';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availability, setAvailability] = useState<DailySlot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [b, a] = await Promise.all([
      supabaseMock.getBookings(),
      supabaseMock.getAvailability()
    ]);
    setBookings(b);
    setAvailability(a);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard bookings={bookings} availability={availability} />;
      case View.AVAILABILITY:
        return <AvailabilityManager availability={availability} onUpdate={fetchData} />;
      case View.CHAT_SIMULATOR:
        return <ChatSimulator availability={availability} bookings={bookings} onBookingConfirmed={fetchData} />;
      case View.SETTINGS:
        return <Settings />;
      case View.LOGS:
        return <Logs bookings={bookings} />;
      default:
        return <Dashboard bookings={bookings} availability={availability} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 capitalize">
                {currentView.replace('_', ' ')}
              </h1>
              <p className="text-gray-500">Gerenciamento n8n + WhatsApp + Supabase</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-gray-600">Automação Ativa</span>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            renderView()
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
