import { CommonModule } from '@angular/common';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth';
import { ThemeService } from '../../core/services/theme';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly themeService = inject(ThemeService);

  protected readonly form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly isDarkTheme = this.themeService.isDarkTheme;
  protected readonly hidePassword: WritableSignal<boolean> = signal(true);
  protected readonly loginDisabled = toSignal(
    this.form.statusChanges.pipe(
      map(() => this.form.invalid),
      startWith(this.form.invalid),
    ),
    { initialValue: this.form.invalid },
  );

  togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    const isAuthenticated = this.authService.login(username!, password!);

    if (!isAuthenticated) {
      this.snackBar.open('Invalid username or password.', 'Dismiss', {
        duration: 3000,
        panelClass: ['snack-error'],
      });
      return;
    }

    this.snackBar.open(`Welcome back, ${username}!`, undefined, {
      duration: 2000,
      panelClass: ['snack-success'],
    });

    this.router.navigate(['/users']);
  }
}
