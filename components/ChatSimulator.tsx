
import React, { useState, useRef, useEffect } from 'react';
import { Message, DailySlot, Booking } from '../types';
import { generateBotResponse } from '../services/gemini';
import { supabaseMock } from '../services/supabaseMock';

interface ChatSimulatorProps {
  availability: DailySlot[];
  bookings: Booking[];
  onBookingConfirmed: () => void;
}

const ChatSimulator: React.FC<ChatSimulatorProps> = ({ availability, bookings, onBookingConfirmed }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Olá! Sou o assistente do ZappReserve. Como posso te ajudar hoje?', sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Context for Gemini
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const responseText = await generateBotResponse(input, history, availability, bookings);
    
    // Check if Gemini triggered a booking confirmation
    // Format: RESERVA_CONFIRMADA: [Data] às [Hora] para [Nome]
    if (responseText.includes('RESERVA_CONFIRMADA:')) {
      const match = responseText.match(/RESERVA_CONFIRMADA:\s*(.*?)\s+às\s+(.*?)\s+para\s+(.*)/i);
      if (match) {
        const [_, date, time, name] = match;
        await supabaseMock.saveBooking({
          customerName: name.trim(),
          phoneNumber: '(11) 99999-9999',
          date: date.trim(),
          time: time.trim(),
          status: 'confirmed'
        });
        onBookingConfirmed();
      }
    }

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText.replace(/RESERVA_CONFIRMADA:.*$/, '').trim() || "Reserva Confirmada com Sucesso!",
      sender: 'bot',
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="flex justify-center h-[calc(100vh-12rem)]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col relative">
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] text-white p-4 flex items-center space-x-3 shadow-md">
          <div className="relative">
             <img src="https://picsum.photos/seed/bot/40/40" className="w-10 h-10 rounded-full" alt="Bot Avatar" />
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#075e54] rounded-full"></span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">ZappReserve AI</p>
            <p className="text-[10px] text-green-100">Online • Automação n8n</p>
          </div>
          <div className="flex space-x-4">
            <i className="fas fa-video cursor-pointer"></i>
            <i className="fas fa-phone cursor-pointer"></i>
            <i className="fas fa-ellipsis-v cursor-pointer"></i>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-3 rounded-xl shadow-sm text-sm relative ${
                msg.sender === 'user' 
                  ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}>
                {msg.text}
                <p className="text-[9px] text-gray-400 mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-2 rounded-xl rounded-tl-none shadow-sm flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="bg-[#f0f2f5] p-3 flex items-center space-x-2">
          <i className="far fa-smile text-gray-500 text-xl cursor-pointer"></i>
          <i className="fas fa-paperclip text-gray-500 text-xl cursor-pointer"></i>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mensagem"
            className="flex-1 px-4 py-2 bg-white rounded-full text-sm focus:outline-none"
          />
          <button 
            type="submit"
            className="w-10 h-10 bg-[#00a884] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <i className="fas fa-paper-plane text-sm ml-0.5"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSimulator;
