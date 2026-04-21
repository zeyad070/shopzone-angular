import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import type { User } from '../models/user.model';
import { API_BASE_URL, STORAGE_KEYS } from '../core/constants/api.constants';
import { CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${API_BASE_URL}/users`;
  private readonly currentUserSubject = new BehaviorSubject<User | null>(this.readStoredUser());
  private readonly authStateSubject = new BehaviorSubject<boolean>(this.hasStoredSession());

  readonly authState$ = this.authStateSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly cart: CartService,
  ) {
    this.syncSessionState(this.currentUserSubject.value);
  }

  isLoggedIn(): boolean {
    return this.authStateSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.userId);
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  login(email: string, password: string): Observable<User> {
    const params = new HttpParams().set('email', email.toLowerCase());

    return this.http.get<User[]>(this.api, { params }).pipe(
      map((users) => {
        const user = users.find((u) => u.password === password);

        if (!user) {
          throw new Error('Invalid email or password');
        }

        return user;
      }),
      tap((user) => {
        this.persistSession(user);
      }),
    );
  }

  register(payload: Pick<User, 'name' | 'email' | 'password'>): Observable<User> {
    const body = {
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: payload.password,
      role: 'user',
    };

    return this.http.post<User>(this.api, body).pipe();
  }
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    this.syncSessionState(null);
    void this.router.navigate(['/login']);
  }

  emailExists(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<User[]>(this.api, { params }).pipe(map((users) => users.length > 0));
  }

  private persistSession(user: User): void {
    const publicUser = this.toPublicUser(user);
    localStorage.setItem(STORAGE_KEYS.userId, publicUser.id.toString());
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(publicUser));
    this.syncSessionState(publicUser);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.currentUser);
    if (!raw) {
      return null;
    }
    try {
      return this.toPublicUser(JSON.parse(raw) as User);
    } catch {
      return null;
    }
  }

  private toPublicUser(user: User): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role ?? 'user',
    };
  }

  private hasStoredSession(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.userId);
  }

  private syncSessionState(user: User | null): void {
    this.currentUserSubject.next(user);
    this.authStateSubject.next(this.hasStoredSession());
    this.cart.refreshCount(this.getUserId());
  }
}
