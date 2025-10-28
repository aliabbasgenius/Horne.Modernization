import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, effect, inject, signal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService, UserDraft } from '../user';
import { User } from '../user.model';
import { UserDialogComponent, UserDialogData } from '../user-dialog/user-dialog';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagementComponent implements AfterViewInit {
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);

  protected readonly displayedColumns = ['name', 'email', 'role', 'status', 'lastActive', 'actions'];
  protected readonly dataSource = new MatTableDataSource<User>(this.userService.list());
  protected readonly filterValue = signal('');

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor() {
    this.dataSource.filterPredicate = (data, filter) => {
      const query = filter.trim().toLowerCase();
      return (
        data.name.toLowerCase().includes(query) ||
        data.email.toLowerCase().includes(query) ||
        data.role.toLowerCase().includes(query) ||
        data.status.toLowerCase().includes(query)
      );
    };

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name':
          return item.name.toLowerCase();
        case 'email':
          return item.email.toLowerCase();
        case 'role':
          return item.role;
        case 'status':
          return item.status;
        case 'lastActive':
          return item.lastActive;
        default:
          return (item as never)[property as never];
      }
    };

    effect(() => {
      this.dataSource.data = this.userService.users();
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(value: string): void {
    this.filterValue.set(value);
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter(): void {
    this.applyFilter('');
  }

  createUser(): void {
    const dialogRef = this.dialog.open<UserDialogComponent, UserDialogData, User>(
      UserDialogComponent,
      {
        autoFocus: false,
        width: '440px',
        data: { mode: 'create' },
      },
    );

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        if (!result) {
          return;
        }

        const { id: _id, ...draft } = result;
        this.userService.create(draft as UserDraft);
      });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open<UserDialogComponent, UserDialogData, User>(
      UserDialogComponent,
      {
        autoFocus: false,
        width: '440px',
        data: { mode: 'edit', user },
      },
    );

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        if (!result) {
          return;
        }

        this.userService.update(result);
      });
  }

  deleteUser(user: User): void {
    if (!confirm(`Remove ${user.name}?`)) {
      return;
    }
    this.userService.delete(user.id);
  }

  formatLastActive(value: string): string {
    return new Date(value).toLocaleDateString();
  }

  statusColor(status: User['status']): 'primary' | 'accent' | 'warn' | undefined {
    switch (status) {
      case 'Active':
        return 'primary';
      case 'Invited':
        return 'accent';
      case 'Suspended':
        return 'warn';
      default:
        return undefined;
    }
  }
}
