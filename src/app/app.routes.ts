import { Routes } from '@angular/router';
import { canActivate } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';
import { User } from '@angular/fire/auth';

const loggedAndEmailVerifidCheck = () =>
  map((user: User | null) => {
    if (!user) return ['login', { error: 'sesion' }];
    if (!user.emailVerified) return ['login', { error: 'email' }];
    return true;
  });

const loggedAndVerified = () =>
  map((user: User | null) => {
    if (user && user.emailVerified) return 'home';
    return true;
  });

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('@pages/home/home.component').then(c => c.HomeComponent),
    ...canActivate(loggedAndEmailVerifidCheck),
  },
  {
    path: 'travel',
    loadComponent: () => import('@pages/travel/travel.component').then(c => c.TravelComponent),
    ...canActivate(loggedAndEmailVerifidCheck),
  },
  {
    path: 'rates',
    loadComponent: () => import('@pages/rates/rates.component').then(c => c.RatesComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/login/login.component').then(c => c.LoginComponent),
    ...canActivate(loggedAndVerified),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
