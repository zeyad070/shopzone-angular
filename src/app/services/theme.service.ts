import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'sz-theme';
  private readonly darkSubject = new BehaviorSubject<boolean>(false);

  readonly isDark$ = this.darkSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    this.apply(isDark);
  }

  toggle(): void {
    this.apply(!this.darkSubject.value);
  }

  get isDark(): boolean {
    return this.darkSubject.value;
  }

  private apply(dark: boolean): void {
    this.darkSubject.next(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');
  }
}
