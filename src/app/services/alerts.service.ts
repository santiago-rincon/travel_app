import { Injectable, inject } from '@angular/core';
import { AlertController, AlertButton } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  private alertController = inject(AlertController);

  async presentAlert({
    header = 'Títlo',
    message = 'Mensaje',
    buttons = [{ text: 'Ok', role: 'ok' }],
  }: {
    header?: string;
    message?: string;
    buttons?: AlertButton[];
  }) {
    const alert = await this.alertController.create({ header, message, buttons, animated: true });
    await alert.present();
    return alert.onWillDismiss();
  }
}
