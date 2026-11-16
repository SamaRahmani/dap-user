import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, shareReplay, tap, throwError } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly ACCESS_TOKEN_KEY = 'dap_access_token';
  private readonly REFRESH_TOKEN_KEY = 'dap_refresh_token';

  private refreshRequest$?: Observable<string>;

  signup(data: SignupRequest): Observable<string> {
    return this.http.post(
      `${API_CONFIG.authUrl}/signup`,
      data,
      { responseType: 'text' }
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${API_CONFIG.authUrl}/login`,
      data
    ).pipe(
      tap(response => this.saveTokens(response))
    );
  }

  refreshAccessToken(): Observable<string> {
    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    this.refreshRequest$ = this.http.post<LoginResponse>(
      `${API_CONFIG.authUrl}/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => this.saveTokens(response)),
      map(response => response.accessToken),
      catchError(error => {
        this.clearSession();
        return throwError(() => error);
      }),
      finalize(() => {
        this.refreshRequest$ = undefined;
      }),
      shareReplay(1)
    );

    return this.refreshRequest$;
  }

  logout(): Observable<void> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.clearSession();
      return new Observable<void>(observer => {
        observer.next();
        observer.complete();
      });
    }

    return this.http.post<void>(
      `${API_CONFIG.authUrl}/logout`,
      { refreshToken }
    ).pipe(
      catchError(() => {
        // Clear the local session even if the server logout request fails.
        return new Observable<void>(observer => {
          observer.next();
          observer.complete();
        });
      }),
      finalize(() => this.clearSession())
    );
  }

  saveTokens(response: LoginResponse): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  clearSession(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}