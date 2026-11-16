
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Insurance {
  insuranceId: string;
  providerName: string;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private http = inject(HttpClient);

  getInsuranceProviders(): Observable<Insurance[]> {
    return this.http.get<Insurance[]>(
      `${API_CONFIG.baseUrl}/api/v1/insurance/providers`
    );
  }
}
