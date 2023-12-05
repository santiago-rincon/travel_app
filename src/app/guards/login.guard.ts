import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '@services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (authService.isLogin()) {
    return true;
  } else {
    presentToast();
    router.navigate(['login']);
    return false;
  }
};

async function presentToast() {
  const toastController = inject(ToastController);
  const toast = await toastController.create({
    message: 'Debes iniciar sesión primero',
    duration: 1500,
    position: 'bottom',
    icon: 'alert-circle',
    color: 'danger',
  });
  await toast.present();
}
