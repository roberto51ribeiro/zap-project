
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-plug mr-3 text-indigo-500"></i>
          Integrações Ativas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* n8n Status */}
          <div className="p-5 border border-gray-100 bg-gray-50 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-700 uppercase tracking-wider text-xs">n8n Workflow</span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-[10px] font-bold">CONECTADO</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Usuário:</strong> betao51</p>
              <p className="text-sm text-gray-600"><strong>Webhook URL:</strong> https://n8n.servico.com/webhook/reservas</p>
              <p className="text-xs text-indigo-500 mt-2 flex items-center cursor-pointer hover:underline">
                <i className="fas fa-external-link-alt mr-1"></i> Abrir Workflow no n8n
              </p>
            </div>
          </div>

          {/* Supabase Status */}
          <div className="p-5 border border-gray-100 bg-gray-50 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-700 uppercase tracking-wider text-xs">Supabase Database</span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-[10px] font-bold">CONECTADO</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Projeto:</strong> zappreserve-db</p>
              <p className="text-sm text-gray-600"><strong>Schema:</strong> public.bookings</p>
              <p className="text-xs text-indigo-500 mt-2 flex items-center cursor-pointer hover:underline">
                <i className="fas fa-table mr-1"></i> Ver tabelas no Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-800 mb-2">Instruções Técnicas</h3>
        <p className="text-sm text-indigo-700 mb-4">
          A automação funciona da seguinte forma:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-indigo-600">
          <li>O <strong>WhatsApp</strong> recebe a mensagem via API da Meta ou Evolution API.</li>
          <li>O <strong>n8n</strong> recebe o JSON e envia para o agente <strong>Gemini</strong> (este app simula este fluxo).</li>
          <li>Se o Gemini retornar uma intenção de reserva, o n8n consulta o <strong>Supabase</strong> para verificar disponibilidade.</li>
          <li>Caso haja vaga, o n8n cria o registro no Supabase e confirma para o cliente via WhatsApp.</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
