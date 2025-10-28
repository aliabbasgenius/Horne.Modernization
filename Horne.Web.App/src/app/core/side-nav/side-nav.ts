import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  description?: string;
}

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
})
export class SideNavComponent {
  @Output() navigate = new EventEmitter<void>();

  protected readonly items: NavItem[] = [
    {
      label: 'User Management',
      icon: 'group',
      route: '/users',
      description: 'Manage application users and access',
    },
  ];

  onNavigate(): void {
    this.navigate.emit();
  }
}
