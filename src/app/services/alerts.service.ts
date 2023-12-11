import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  private alertController = inject(AlertController);

  async presentAlert({ header = 'Títlo', message = 'Mensaje', buttons = ['Ok'] }) {
    const alert = await this.alertController.create({ header, message, buttons, animated: true });
    await alert.present();
  }
}
