import { AppError } from '../utils/AppError';

export interface EventItem {
  id: number;
  venueId: number;
  title: string;
  eventDate: string;
  basePrice: number;
  availableTickets: number;
}

export class EventService {
  private events: EventItem[] = [
    { id: 1, venueId: 1, title: 'Симфонічний рок-концерт «океан звуку»', eventDate: '2026-12-10T19:00:00Z', basePrice: 850, availableTickets: 420 },
    { id: 2, venueId: 2, title: 'Камерний вечір класичної музики', eventDate: '2026-12-15T18:30:00Z', basePrice: 400, availableTickets: 180 },
    { id: 3, venueId: 3, title: 'TechConf Ukraine: Modern Web & Cloud 2026', eventDate: '2026-12-20T10:00:00Z', basePrice: 1200, availableTickets: 95 }
  ];

  getAll(): EventItem[] {
    return this.events;
  }

  getById(id: number): EventItem {
    const event = this.events.find(e => e.id === id);
    if (!event) {
      throw new AppError('Захід із вказаним ідентифікатором не знайдено', 404);
    }
    return event;
  }

  create(data: Omit<EventItem, 'id'>): EventItem {
    if (!data.title || !data.venueId || !data.eventDate || data.basePrice === undefined) {
      throw new AppError('Некоректні або неповні дані заходу', 400);
    }
    const nextId = this.events.length > 0 ? Math.max(...this.events.map(e => e.id)) + 1 : 1;
    const newEvent: EventItem = {
      id: nextId,
      venueId: Number(data.venueId),
      title: data.title,
      eventDate: data.eventDate,
      basePrice: Number(data.basePrice),
      availableTickets: Number(data.availableTickets ?? 100)
    };
    this.events.push(newEvent);
    return newEvent;
  }
}
