import { CommonModule } from '@angular/common';
import { Component, Inject, WritableSignal, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../user.model';

export interface UserDialogData {
  mode: 'create' | 'edit';
  user?: User;
}

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss',
})
export class UserDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['Analyst' as User['role'], [Validators.required]],
    status: ['Active' as User['status'], [Validators.required]],
    lastActive: [this.today(), [Validators.required]],
  });

  protected readonly title = computed(() =>
    this.data.mode === 'create' ? 'Add user' : 'Edit user',
  );

  constructor(@Inject(MAT_DIALOG_DATA) protected readonly data: UserDialogData) {
    if (data.user) {
      this.form.patchValue({
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        lastActive: this.toDateInput(data.user.lastActive),
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const result: User = {
      id: this.data.user?.id ?? 0,
      name: formValue.name,
      email: formValue.email,
      role: formValue.role,
      status: formValue.status,
      lastActive: this.toIsoString(formValue.lastActive),
    };

    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private today(): string {
    return this.toDateInput(new Date().toISOString());
  }

  private toDateInput(value: string): string {
    return value ? value.substring(0, 10) : this.today();
  }

  private toIsoString(dateValue: string): string {
    if (!dateValue) {
      return new Date().toISOString();
    }
    const date = new Date(dateValue);
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0),
    ).toISOString();
  }
}
