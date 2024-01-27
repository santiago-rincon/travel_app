import { Routes } from '@angular/router';
import { canActivate } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';
import { User } from '@angular/fire/auth';
import { HomeComponent } from '@pages/home/home.component';

const homeGuard = () =>
  map((user: User | null) => {
    if (!user) return ['login', { error: 'sesion' }];
    if (!user.emailVerified) return ['login', { error: 'email' }];
    return true;
  });

const loginGuard = () =>
  map((user: User | null) => {
    if (user && user.emailVerified) return 'home';
    return true;
  });

const travelGuard = () =>
  map((user: User | null) => {
    if (!user) return ['login', { error: 'sesion' }];
    if (!user.emailVerified) return ['login', { error: 'email' }];
    if (!localStorage.getItem('profile')) return 'home';
    return true;
  });

export const routes: Routes = [
  {
    path: 'home',
    // loadComponent: () => import('@pages/home/home.component').then(c => c.HomeComponent),
    component: HomeComponent,
    ...canActivate(homeGuard),
  },
  {
    path: 'travel',
    loadComponent: () => import('@pages/travel/travel.component').then(c => c.TravelComponent),
    ...canActivate(travelGuard),
  },
  {
    path: 'rates',
    loadComponent: () => import('@pages/rates/rates.component').then(c => c.RatesComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('@pages/login/login.component').then(c => c.LoginComponent),
    ...canActivate(loginGuard),
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
