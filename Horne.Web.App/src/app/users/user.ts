import { Injectable, computed, signal, WritableSignal } from '@angular/core';
import { User } from './user.model';

export type UserDraft = Omit<User, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly usersSignal: WritableSignal<User[]> = signal([
    {
      id: 1,
      name: 'Ava Martinez',
      email: 'ava.martinez@example.com',
      role: 'Admin',
      status: 'Active',
      lastActive: '2025-10-11T09:15:00Z',
    },
    {
      id: 2,
      name: 'Noah Patel',
      email: 'noah.patel@example.com',
      role: 'Manager',
      status: 'Active',
      lastActive: '2025-10-21T16:42:00Z',
    },
    {
      id: 3,
      name: 'Sophia Chen',
      email: 'sophia.chen@example.com',
      role: 'Analyst',
      status: 'Invited',
      lastActive: '2025-10-02T12:08:00Z',
    },
    {
      id: 4,
      name: 'Mason Johnson',
      email: 'mason.johnson@example.com',
      role: 'Viewer',
      status: 'Suspended',
      lastActive: '2025-08-19T07:22:00Z',
    },
    {
      id: 5,
      name: 'Liam Smith',
      email: 'liam.smith@example.com',
      role: 'Analyst',
      status: 'Active',
      lastActive: '2025-10-25T11:30:00Z',
    },
    {
      id: 6,
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      role: 'Manager',
      status: 'Active',
      lastActive: '2025-10-26T15:55:00Z',
    },
    {
      id: 7,
      name: 'James Lee',
      email: 'james.lee@example.com',
      role: 'Viewer',
      status: 'Invited',
      lastActive: '2025-09-29T10:05:00Z',
    },
    {
      id: 8,
      name: 'Isabella Davis',
      email: 'isabella.davis@example.com',
      role: 'Analyst',
      status: 'Active',
      lastActive: '2025-10-24T14:10:00Z',
    },
  ]);

  private readonly nextId = signal(this.computeNextId());

  readonly users = this.usersSignal.asReadonly();
  readonly totalUsers = computed(() => this.usersSignal().length);

  list(): User[] {
    return this.usersSignal();
  }

  create(draft: UserDraft): User {
    const user: User = { ...draft, id: this.nextId(), lastActive: draft.lastActive };
    this.usersSignal.update((users) => [...users, user]);
    this.incrementId();
    return user;
  }

  update(user: User): void {
    this.usersSignal.update((users) =>
      users.map((existing) => (existing.id === user.id ? { ...user } : existing)),
    );
  }

  delete(id: number): void {
    this.usersSignal.update((users) => users.filter((user) => user.id !== id));
  }

  private computeNextId(): number {
    return (
      this.usersSignal()
        .map((user) => user.id)
        .reduce((max, current) => Math.max(max, current), 0) + 1
    );
  }

  private incrementId(): void {
    this.nextId.update((value) => value + 1);
  }
}
