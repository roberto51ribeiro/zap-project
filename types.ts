
export enum View {
  DASHBOARD = 'dashboard',
  AVAILABILITY = 'availability',
  CHAT_SIMULATOR = 'chat_simulator',
  SETTINGS = 'settings',
  LOGS = 'logs'
}

export interface Booking {
  id: string;
  customerName: string;
  phoneNumber: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface DailySlot {
  date: string;
  totalSpaces: number;
  availableSpaces: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
