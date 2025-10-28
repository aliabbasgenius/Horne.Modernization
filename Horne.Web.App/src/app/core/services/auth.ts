import { Injectable, computed, signal, WritableSignal } from '@angular/core';

interface AuthenticatedUser {
  username: string;
  displayName: string;
}

interface Credential {
  username: string;
  password: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'horne-web-app.auth';
  private readonly allowedUsers: Credential[] = [
    { username: 'admin', password: 'Admin@123', displayName: 'System Admin' },
    { username: 'manager', password: 'Manager@123', displayName: 'Team Manager' },
  ];

  private readonly activeUser: WritableSignal<AuthenticatedUser | null> = signal(
    this.restoreUser(),
  );

  readonly user = this.activeUser.asReadonly();
  readonly authenticated = computed(() => this.activeUser() !== null);

  login(username: string, password: string): boolean {
    const match = this.allowedUsers.find(
      (user) => user.username === username && user.password === password,
    );

    if (!match) {
      return false;
    }

    const authUser: AuthenticatedUser = {
      username: match.username,
      displayName: match.displayName,
    };

    this.activeUser.set(authUser);
    this.persistUser(authUser);
    return true;
  }

  logout(): void {
    this.activeUser.set(null);
    this.clearStoredUser();
  }

  isAuthenticated(): boolean {
    return this.authenticated();
  }

  private restoreUser(): AuthenticatedUser | null {
    try {
      const stored = this.getStorage()?.getItem(this.storageKey);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored) as AuthenticatedUser;
      if (!parsed?.username) {
        return null;
      }

      const stillValid = this.allowedUsers.some(
        (user) => user.username === parsed.username,
      );

      return stillValid ? parsed : null;
    } catch {
      return null;
    }
  }

  private persistUser(user: AuthenticatedUser): void {
    try {
      this.getStorage()?.setItem(this.storageKey, JSON.stringify(user));
    } catch {
      // Ignore persistence failures (private browsing, etc.).
    }
  }

  private clearStoredUser(): void {
    try {
      this.getStorage()?.removeItem(this.storageKey);
    } catch {
      // Ignore cleanup failures.
    }
  }

  private getStorage(): Storage | null {
    try {
      return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
      return null;
    }
  }
}
