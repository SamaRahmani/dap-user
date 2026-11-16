
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface State {
  stateCode: string;
  stateName: string;
}

export interface City {
  cityId: number;
  cityName: string;
  stateCode: string;
}

export interface Rto {
  rtoCode: string;
  rtoName: string;
  stateCode: string;
  cityId: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(
      `${API_CONFIG.baseUrl}/api/v1/locations/states`
    );
  }

  getCities(stateCode: string): Observable<City[]> {
    return this.http.get<City[]>(
      `${API_CONFIG.baseUrl}/api/v1/locations/cities/${stateCode}`
    );
  }

  getRtos(cityId: number): Observable<Rto[]> {
    return this.http.get<Rto[]>(
      `${API_CONFIG.baseUrl}/api/v1/locations/rtos/${cityId}`
    );
  }
}
