import { Routes } from '@angular/router';
import { loginGuard } from '@guards/login.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('@pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'travel',
    loadComponent: () => import('@pages/travel/travel.component').then(m => m.TravelComponent),
    canActivate: [loginGuard],
  },
  {
    path: 'rates',
    loadComponent: () => import('@pages/rates/rates.component').then(m => m.RatesComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
