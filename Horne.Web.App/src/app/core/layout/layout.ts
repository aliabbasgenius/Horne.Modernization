import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { HeaderComponent } from '../header/header';
import { SideNavComponent } from '../side-nav/side-nav';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    HeaderComponent,
    SideNavComponent,
    FooterComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent {
  @ViewChild(MatSidenav) sidenav?: MatSidenav;

  protected readonly isHandset = signal(false);
  private readonly breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((result) => result.matches), takeUntilDestroyed())
      .subscribe((matches) => {
        this.isHandset.set(matches);
        if (matches) {
          this.sidenav?.close();
        } else {
          this.sidenav?.open();
        }
      });
  }

  onMenuToggle(): void {
    if (this.isHandset()) {
      this.sidenav?.toggle();
    }
  }

  onNavigate(): void {
    if (this.isHandset()) {
      this.sidenav?.close();
    }
  }

}
