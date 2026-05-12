import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisteredUser,
} from './auth.types';

const ACCESS_TOKEN_KEY = 'anybank.accessToken';
const REFRESH_TOKEN_KEY = 'anybank.refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  register(body: RegisterRequest): Observable<RegisteredUser> {
    return this.http
      .post<RegisteredUser>(`${this.baseUrl}/auth/register`, body)
      .pipe(catchError(this.toApiError));
  }

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/login`, body)
      .pipe(catchError(this.toApiError));
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private toApiError(err: HttpErrorResponse): Observable<never> {
    const body = err.error as ApiError | null;
    const fallback =
      err.status === 0
        ? 'Não foi possível conectar ao servidor.'
        : 'Algo deu errado, tente novamente.';
    const message = body?.message ?? fallback;
    return throwError(() => ({ status: err.status, message, body }));
  }
}
