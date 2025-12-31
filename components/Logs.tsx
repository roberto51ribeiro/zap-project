
import React from 'react';
import { Booking } from '../types';

interface LogsProps {
  bookings: Booking[];
}

const Logs: React.FC<LogsProps> = ({ bookings }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Telefone</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Data/Hora</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Data Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {booking.customerName.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">{booking.customerName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{booking.phoneNumber}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{booking.date}</span>
                    <span className="text-xs text-gray-500">{booking.time}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">
                  {new Date(booking.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Nenhuma reserva registrada no sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;
