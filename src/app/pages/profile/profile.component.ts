import { Component } from '@angular/core';
import type { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { STORAGE_KEYS } from '../../core/constants/api.constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  standalone: false,
})
export class ProfileComponent {
  user: User | null;

  constructor(private readonly auth: AuthService) {
    this.user = this.auth.getCurrentUser();
  }

  userIdLabel(): string {
    return localStorage.getItem(STORAGE_KEYS.userId) ?? '—';
  }

  logout(): void {
    this.auth.logout();
  }
}
