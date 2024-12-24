import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../model/property.model';

const endpoint = 'http://localhost:3000/properties/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  constructor(private http: HttpClient) { }

  getProperty(id: string): Observable<any> {
    return this.http.get(endpoint + `api/show/${id}`);
  }

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(endpoint + 'api'); 
  }

  getPropertyImage(id: string): Observable<Blob> {
    return this.http.get(`http://localhost:3000/properties/image/${id}`, { responseType: 'blob' });
  }
}
