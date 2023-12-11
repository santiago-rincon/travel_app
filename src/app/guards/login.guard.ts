import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthFireService } from '@services/auth-fire.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthFireService);
  authService.getSesion();
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
