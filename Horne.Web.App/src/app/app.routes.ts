import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
	{
		path: 'login',
			loadComponent: () =>
				import('./auth/login/login').then((m) => m.LoginComponent),
	},
	{
		path: '',
		canActivate: [authGuard],
		loadComponent: () =>
				import('./core/layout/layout').then((m) => m.LayoutComponent),
		children: [
			{
				path: 'users',
				loadComponent: () =>
						import('./users/user-management/user-management').then(
						(m) => m.UserManagementComponent,
					),
			},
			{ path: '', pathMatch: 'full', redirectTo: 'users' },
		],
	},
	{ path: '**', redirectTo: '' },
];
