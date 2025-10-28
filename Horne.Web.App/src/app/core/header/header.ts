import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../services/theme';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  @Input() isHandset = false;
  @Output() menuToggle = new EventEmitter<void>();

  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isDarkTheme = this.themeService.isDarkTheme;
  readonly currentUser = this.authService.user;
  readonly initials = computed(() => this.computeInitials());

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onMenu(): void {
    this.menuToggle.emit();
  }

  private computeInitials(): string {
    const user = this.currentUser();
    if (!user?.displayName) {
      return 'HM';
    }

    const parts = user.displayName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0]!.substring(0, 2).toUpperCase();
    }

    return (
      (parts[0]?.charAt(0) ?? '') + (parts[parts.length - 1]?.charAt(0) ?? '')
    ).toUpperCase();
  }
}
