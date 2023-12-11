import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Menu } from 'app/schemas/interfaces';
import { MenuController } from '@ionic/angular/standalone';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';

@Component({
  standalone: true,
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styles: `
  .active{
    color: var(--ion-color-primary);
  }
  `,
  imports: [IconsModule, IonicModule, RouterLink, RouterLinkActive],
})
export class TabsComponent {
  menuCtrl = inject(MenuController);
  menus: Menu[] = [
    { title: 'Inicio', icon: 'home', path: 'home', onClick: () => null },
    { title: 'Viajar', icon: 'car', path: 'travel', onClick: () => null },
    { title: 'Más', icon: 'ellipsis-horizontal', onClick: () => this.onClick() },
  ];

  onClick() {
    this.menuCtrl.toggle('main-menu');
  }
}
