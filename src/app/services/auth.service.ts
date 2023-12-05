import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoginSignal = signal(true);
  isLogin = computed(() => this.isLoginSignal());
}
