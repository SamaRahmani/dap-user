
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

// Vehicle details for vehicle mode
export interface DapVehicleDetails {
  modelName: string;
  variantName: string;
}

// Registration location
export interface DapLocationDetails {
  state: string;
  city: string;
  rtoCode: string;
}

// Request sent to Spring Boot
export interface DapCalculationRequest {
  vehicle: DapVehicleDetails | null;
  exShowroomPrice: number | null;
  location: DapLocationDetails;
  insuranceProvider: string;
}

// Response received from Spring Boot
export interface DapCalculationResponse {
  modelName: string | null;
  variantName: string | null;

  stateName: string;
  cityName: string;
  rtoCode: string;

  insuranceProvider: string;
  insurancePercentage: number;

  exShowroomPrice: number;
  insurancePremium: number;

  nationalCharges: number;
  stateCharges: number;
  cityCharges: number;

  registrationCharges: number;
  totalDriveAwayPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class DapCalculationService {

  private http = inject(HttpClient);

  calculateDap(
    request: DapCalculationRequest
  ): Observable<DapCalculationResponse> {

    return this.http.post<DapCalculationResponse>(
      `${API_CONFIG.baseUrl}/api/v1/dap/calculate`,
      request
    );
  }
}
