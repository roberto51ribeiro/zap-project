
import { Booking, DailySlot } from "../types";

// Simulating database storage
const STORAGE_KEY_BOOKINGS = 'zapp_reserve_bookings';
const STORAGE_KEY_SLOTS = 'zapp_reserve_slots';

export const supabaseMock = {
  async getBookings(): Promise<Booking[]> {
    const data = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    return data ? JSON.parse(data) : [];
  },

  async saveBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const bookings = await this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    
    // Update availability
    await this.decrementAvailability(booking.date);
    
    return newBooking;
  },

  async getAvailability(): Promise<DailySlot[]> {
    const data = localStorage.getItem(STORAGE_KEY_SLOTS);
    if (!data) {
      // Default slots
      const defaults: DailySlot[] = [
        { date: '2023-11-20', totalSpaces: 10, availableSpaces: 10 },
        { date: '2023-11-21', totalSpaces: 10, availableSpaces: 8 },
        { date: '2023-11-22', totalSpaces: 15, availableSpaces: 15 },
      ];
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  },

  async updateAvailability(date: string, spaces: number): Promise<void> {
    const slots = await this.getAvailability();
    const idx = slots.findIndex(s => s.date === date);
    if (idx >= 0) {
      slots[idx].totalSpaces = spaces;
      // Recalculate available based on current bookings if this were real
      slots[idx].availableSpaces = spaces; 
    } else {
      slots.push({ date, totalSpaces: spaces, availableSpaces: spaces });
    }
    localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(slots));
  },

  async decrementAvailability(date: string): Promise<void> {
    const slots = await this.getAvailability();
    const idx = slots.findIndex(s => s.date === date);
    if (idx >= 0 && slots[idx].availableSpaces > 0) {
      slots[idx].availableSpaces -= 1;
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(slots));
    }
  }
};
