import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Vehicle {
  vehicleId: string;
  modelName: string;
  variantName: string;
  fuelType: string;
  transmissionType: string;
  exShowroomPrice: number;
  lengthMm: number;
  groundClearanceMm: number;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(
      `${API_CONFIG.baseUrl}/api/v1/vehicles`
    );
  }
}