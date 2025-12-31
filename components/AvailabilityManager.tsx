
import React, { useState } from 'react';
import { DailySlot } from '../types';
import { supabaseMock } from '../services/supabaseMock';

interface AvailabilityManagerProps {
  availability: DailySlot[];
  onUpdate: () => void;
}

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ availability, onUpdate }) => {
  const [newDate, setNewDate] = useState('');
  const [newSpaces, setNewSpaces] = useState(10);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    
    setIsUpdating(true);
    await supabaseMock.updateAvailability(newDate, newSpaces);
    onUpdate();
    setNewDate('');
    setIsUpdating(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Configurar Espaços</h3>
        <p className="text-sm text-gray-500 mb-6">Define a quantidade de vagas que a automação n8n poderá reservar por dia.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input 
              type="date" 
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de Vagas</label>
            <input 
              type="number" 
              min="1"
              required
              value={newSpaces}
              onChange={(e) => setNewSpaces(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button 
            type="submit"
            disabled={isUpdating}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isUpdating ? 'Salvando...' : 'Salvar Configuração'}
          </button>
        </form>
      </div>

      <div className="md:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 px-2">Calendário de Disponibilidade</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availability.sort((a, b) => a.date.localeCompare(b.date)).map((slot) => (
            <div key={slot.date} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-indigo-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  {new Date(slot.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}
                </div>
                <span className="text-gray-400 text-sm font-medium">{slot.date}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 text-sm">Disponibilidade</span>
                  <span className="text-2xl font-bold text-gray-800">{slot.availableSpaces} <span className="text-sm font-normal text-gray-400">/ {slot.totalSpaces}</span></span>
                </div>
                
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      (slot.availableSpaces / slot.totalSpaces) < 0.2 ? 'bg-red-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${(slot.availableSpaces / slot.totalSpaces) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          {availability.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-100">
              Nenhuma data configurada. Comece adicionando uma no formulário ao lado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;
