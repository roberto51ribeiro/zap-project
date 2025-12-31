
import React from 'react';
import { Booking, DailySlot } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  bookings: Booking[];
  availability: DailySlot[];
}

const Dashboard: React.FC<DashboardProps> = ({ bookings, availability }) => {
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalSpaces = availability.reduce((acc, curr) => acc + curr.totalSpaces, 0);
  const remainingSpaces = availability.reduce((acc, curr) => acc + curr.availableSpaces, 0);

  const chartData = availability.map(slot => ({
    name: slot.date,
    available: slot.availableSpaces,
    occupied: slot.totalSpaces - slot.availableSpaces
  }));

  const stats = [
    { label: 'Total de Reservas', value: totalBookings, icon: 'fa-book', color: 'bg-blue-500' },
    { label: 'Confirmadas', value: confirmedBookings, icon: 'fa-check-circle', color: 'bg-green-500' },
    { label: 'Capacidade Total', value: totalSpaces, icon: 'fa-users', color: 'bg-purple-500' },
    { label: 'Vagas Livres', value: remainingSpaces, icon: 'fa-door-open', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              </div>
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Ocupação por Data</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="occupied" fill="#6366f1" radius={[4, 4, 0, 0]} name="Ocupado" />
                <Bar dataKey="available" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Disponível" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Últimas Reservas</h3>
          <div className="space-y-4">
            {bookings.slice(-5).reverse().map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{booking.customerName}</p>
                  <p className="text-xs text-gray-500">{booking.date} às {booking.time}</p>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-center text-gray-400 py-8">Nenhuma reserva encontrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
