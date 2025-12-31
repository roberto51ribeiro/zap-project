
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Painel Geral', icon: 'fa-chart-pie' },
    { id: View.AVAILABILITY, label: 'Disponibilidade', icon: 'fa-calendar-check' },
    { id: View.CHAT_SIMULATOR, label: 'Simulador WhatsApp', icon: 'fa-whatsapp' },
    { id: View.LOGS, label: 'Logs de Reservas', icon: 'fa-list-ul' },
    { id: View.SETTINGS, label: 'Configurações', icon: 'fa-cog' },
  ];

  return (
    <aside className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <i className="fas fa-robot text-2xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">ZappReserve</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-indigo-700 text-white shadow-lg' 
                  : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-lg`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-indigo-800">
        <div className="flex items-center space-x-3">
          <img 
            src="https://picsum.photos/seed/admin/40/40" 
            className="w-10 h-10 rounded-full border-2 border-indigo-400"
            alt="Profile"
          />
          <div>
            <p className="text-sm font-semibold">Betao51</p>
            <p className="text-xs text-indigo-300">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
