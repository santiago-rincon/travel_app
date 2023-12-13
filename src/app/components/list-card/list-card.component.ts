import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@modules/ionic.module';

@Component({
  standalone: true,
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  imports: [IonicModule],
})
export class ListCardComponent {
  private modalController = inject(ModalController);

  onClick(vehicle: string) {
    this.modalController.dismiss(vehicle, 'vehicle-selected');
  }
}
