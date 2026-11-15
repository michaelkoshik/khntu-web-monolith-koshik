import { AppError } from '../utils/AppError';

export interface Venue {
  id: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
}

export class VenueService {
  private venues: Venue[] = [
    { id: 1, name: 'алац культури «країна»', city: 'иїв', address: 'вул. елика асильківська, 103', capacity: 3714 },
    { id: 2, name: 'ілармонія ім. . исенка', city: 'Хмельницький', address: 'вул. агаріна, 7', capacity: 650 },
    { id: 3, name: 'онференц-хол «Unit.Verse»', city: 'иїв', address: 'вул. орогожицька, 3', capacity: 400 }
  ];

  getAll(): Venue[] {
    return this.venues;
  }

  getById(id: number): Venue {
    const venue = this.venues.find(v => v.id === id);
    if (!venue) {
      throw new AppError('айданчик проведення заходів не знайдено', 404);
    }
    return venue;
  }

  create(data: Omit<Venue, 'id'>): Venue {
    if (!data.name || !data.city || !data.address || !data.capacity) {
      throw new AppError('сі поля майданчика (name, city, address, capacity) є обов’язковими', 400);
    }
    const nextId = this.venues.length > 0 ? Math.max(...this.venues.map(v => v.id)) + 1 : 1;
    const newVenue: Venue = { id: nextId, ...data };
    this.venues.push(newVenue);
    return newVenue;
  }
}
