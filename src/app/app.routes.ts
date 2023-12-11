import { Routes } from '@angular/router';
import { canActivate } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';
import { User } from '@angular/fire/auth';

const loggedAndEmailVerifid = () =>
  map((user: User | null) => {
    if (!user) return ['login', { error: 'sesion' }];
    if (!user.emailVerified) return ['login', { error: 'email' }];
    return true;
  });

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('@pages/home/home.component').then(c => c.HomeComponent),
    ...canActivate(loggedAndEmailVerifid),
  },
  {
    path: 'travel',
    loadComponent: () => import('@pages/travel/travel.component').then(c => c.TravelComponent),
    ...canActivate(loggedAndEmailVerifid),
  },
  {
    path: 'rates',
    loadComponent: () => import('@pages/rates/rates.component').then(c => c.RatesComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/login/login.component').then(c => c.LoginComponent),
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
