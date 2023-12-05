import { Component, ElementRef, Input, QueryList, Renderer2, ViewChildren, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InteractiveItems, SavedDirections, Slot } from '@interfaces/interfaces';
import { ToastController } from '@ionic/angular/standalone';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';

@Component({
  standalone: true,
  selector: 'app-interactive-list',
  templateUrl: './interactive-list.component.html',
  imports: [IonicModule, IconsModule],
})
export class InteractiveListComponent {
  @Input() title = 'Título';
  @Input() voidData = 'Texto cuando el array de datos está vacío';
  @Input() items: SavedDirections[] = [];
  @Input() mainPath: string = '';
  @ViewChildren('listItems') listItems!: QueryList<ElementRef>;
  render = inject(Renderer2);
  toast = inject(ToastController);
  router = inject(Router);
  itemDeleted: InteractiveItems[] = [];
  constructor() {}

  onSwipe(i: number, slot: Slot) {
    const item = this.listItems.get(i)?.nativeElement;
    this.render.addClass(item, `${slot === 'start' ? 'animate__slideOutRight' : 'animate__slideOutLeft'}`);
    this.render.listen(item, 'animationend', () => {
      this.render.addClass(item, 'hidden');
      this.items.splice(i, 1);
      this.presentToast();
      console.log('Eliminando de base de datos');
    });
  }

  private async presentToast() {
    const notification = await this.toast.create({
      message: 'Dirección eliminada correctamente',
      duration: 3000,
    });
    await notification.present();
  }

  createTravel(coords: google.maps.LatLngLiteral) {
    this.router.navigate([this.mainPath], {
      queryParams: {
        lat: coords.lat,
        lng: coords.lng,
      },
    });
  }
}
