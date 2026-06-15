import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AccessTokenClaims,
  ApiError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisteredUser,
  UserProfile,
} from './auth.types';

const ACCESS_TOKEN_KEY = 'anybank.accessToken';
const REFRESH_TOKEN_KEY = 'anybank.refreshToken';
const USER_KEY = 'anybank.user';

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

    const claims = this.decodeToken(response.accessToken);
    if (claims) {
      const user: UserProfile = {
        id: claims.sub,
        name: claims.name,
        email: claims.email,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  logout(): void {
    this.clearSession();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getUser(): UserProfile | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private decodeToken(token: string): AccessTokenClaims | null {
    const payload = token.split('.')[1];
    if (!payload) return null;
    try {
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(normalized)) as AccessTokenClaims;
    } catch {
      return null;
    }
  }

  private toApiError(err: HttpErrorResponse): Observable<never> {
    const body = err.error as ApiError | null;
    const fallback =
      err.status === 0
        ? 'Não foi possível conectar ao servidor.'
        : 'Algo deu errado, tente novamente.';
    const fieldMessage = body?.errors?.map((e) => e.message).join(' ');
    const message = fieldMessage || body?.message || fallback;
    return throwError(() => ({ status: err.status, message, body }));
  }
}
