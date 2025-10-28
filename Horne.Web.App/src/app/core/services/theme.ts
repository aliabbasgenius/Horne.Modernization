import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal, type WritableSignal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'horne-web-app.theme';
  private readonly document = inject(DOCUMENT);
  private readonly mode: WritableSignal<ThemeMode> = signal(this.readStoredTheme());

  readonly theme = this.mode.asReadonly();
  readonly isDarkTheme = computed(() => this.mode() === 'dark');

  initialize(): void {
    this.applyTheme(this.mode());
  }

  toggleTheme(): void {
    const next = this.mode() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(mode: ThemeMode): void {
    this.mode.set(mode);
    this.storeTheme(mode);
    this.applyTheme(mode);
  }

  private applyTheme(mode: ThemeMode): void {
    const body = this.document.body.classList;
    body.remove('light-theme', 'dark-theme');
    body.add(`${mode}-theme`);
  }

  private readStoredTheme(): ThemeMode {
    const stored = this.getStorage()?.getItem(this.storageKey) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    const prefersDark = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    return prefersDark ? 'dark' : 'light';
  }

  private storeTheme(mode: ThemeMode): void {
    this.getStorage()?.setItem(this.storageKey, mode);
  }

  private getStorage(): Storage | null {
    try {
      return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
      return null;
    }
  }
}
