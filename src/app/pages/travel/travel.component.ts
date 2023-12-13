import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListCardComponent } from '@components/list-card/list-card.component';
import { MapsComponent } from '@components/maps/maps.component';
import { ModalComponent } from '@components/modal/modal.component';
import { ModalController } from '@ionic/angular/standalone';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';
import { AlertsService } from '@services/alerts.service';
import { GoogleMapsService } from '@services/google-maps.service';

@Component({
  standalone: true,
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  imports: [IonicModule, IconsModule, MapsComponent, ModalComponent, ListCardComponent],
})
export class TravelComponent implements OnInit {
  private modalController = inject(ModalController);
  private googleMapsService = inject(GoogleMapsService);
  private activedRoute = inject(ActivatedRoute);
  private alertsService = inject(AlertsService);
  typeOfVehicle: string = '';
  calcRouteInProgress = false;
  ngOnInit() {
    this.activedRoute.queryParams.subscribe(params => {
      const { lat, lng, vehicle } = params;
      if (vehicle === 'car' || vehicle === 'bicycle') this.typeOfVehicle = vehicle;
      if (!lat || !lng) {
        this.openModal();
      } else {
        const [latNumber, lngNumber] = [Number(lat), Number(lng)];
        !latNumber || !lngNumber ? this.openModal() : (this.googleMapsService.directionSavedSet = { lat, lng });
      }
    });
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
    });
    modal.present();
  }

  getMyPosition() {
    this.googleMapsService.getPosition.emit();
  }

  async orderService() {
    if (this.typeOfVehicle === '') {
      this.openModalOptionsVehicle();
    } else {
      const message = `¿Estás seguro de que desea pedir el servicio en ${
        this.typeOfVehicle === 'car' ? 'carro' : 'moto'
      } ?`;
      const { role } = await this.alertsService.presentAlert({
        header: 'Confirma tu viaje',
        message,
        buttons: [
          { text: 'No', role: 'no' },
          { text: 'Si', role: 'yes' },
        ],
      });
      if (role === 'no') return;
      console.log('pidiendo');

      // this.calcRouteInProgress = true;
      // this.googleMapsService.orderService.emit(this.typeOfVehicle);
    }
  }

  async openModalOptionsVehicle() {
    const modal = await this.modalController.create({
      component: ListCardComponent,
      initialBreakpoint: 0.3,
      breakpoints: [0.3, 0.5],
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.typeOfVehicle = data;
    }
  }
}
