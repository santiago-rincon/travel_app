import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapsComponent } from '@components/maps/maps.component';
import { ModalComponent } from '@components/modal/modal.component';
import { ModalController } from '@ionic/angular/standalone';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';
import { GoogleMapsService } from '@services/google-maps.service';

@Component({
  standalone: true,
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  imports: [IonicModule, IconsModule, MapsComponent, ModalComponent],
})
export class TravelComponent implements OnInit {
  // private queryParams: google.maps.LatLngLiteral | undefined = undefined;
  private modalController = inject(ModalController);
  private googleMapsService = inject(GoogleMapsService);
  private activedRoute = inject(ActivatedRoute);
  calcRouteInProgress = false;
  ngOnInit() {
    this.activedRoute.queryParams.subscribe(params => {
      if (!params['lat'] || !params['lng']) {
        this.openModal();
      } else {
        const [lat, lng] = [Number(params['lat']), Number(params['lng'])];
        !lat || !lng ? this.openModal() : (this.googleMapsService.directionSavedSet = { lat, lng });
      }
    });
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
    });
    // this.googleMapsService.bounds.emit();
    modal.present();
  }

  getMyPosition() {
    this.googleMapsService.getPosition.emit();
  }

  orderService() {
    this.calcRouteInProgress = true;
    this.googleMapsService.orderService.emit();
  }
}
