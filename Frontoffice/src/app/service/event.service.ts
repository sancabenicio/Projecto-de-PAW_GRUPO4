import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../model/event.model';

const endpoint = 'http://localhost:3000/events/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) { }

  getEvent(id: string): Observable<any> {
    return this.http.get(endpoint + `api/show/${id}`);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(endpoint + 'api');
  }

  getEventImage(id: string): Observable<Blob> {
    return this.http.get(`http://localhost:3000/events/image/${id}`, { responseType: 'blob' });
  }

  buyTicket(eventId: string, userEmail: string, ticketQuantity: number): Observable<any> {
    const body = {
      eventId: eventId,
      email: userEmail, 
      quantity: ticketQuantity 
    };
  
    return this.http.post(endpoint + 'api/buy-ticket', body, httpOptions);
  }
}





