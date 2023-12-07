import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';
import { Menu } from 'app/schemas/interfaces';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuController } from '@ionic/angular/standalone';
import { TabsComponent } from '@components/tabs/tabs.component';

@Component({
  standalone: true,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  imports: [IconsModule, IonicModule, FormsModule, RouterLink, RouterLinkActive, TabsComponent],
})
export class MenuComponent implements OnInit {
  @Input() titleApp = 'Título de la App';
  menuCtrl = inject(MenuController);
  isDark = false;
  menusLgScreen: Menu[] = [
    { title: 'Inicio', icon: 'home', path: 'home' },
    { title: 'Viajar', icon: 'car', path: 'travel' },
  ];
  menus: Menu[] = [
    { title: 'Perfil', icon: 'person-circle', path: 'profile' },
    { title: 'Tarifas', icon: 'cash', path: 'rates' },
    { title: 'Ajustes', icon: 'settings', path: 'settings' },
    { title: 'Información', icon: 'information-circle', path: 'information' },
  ];

  ngOnInit() {
    const storageDark = localStorage.getItem('isDark');
    if (storageDark === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      const dark = prefersDark.matches;
      this.isDark = dark;
      document.body.classList.toggle('dark', dark);
      localStorage.setItem('isDark', dark.toString());
    } else {
      this.isDark = storageDark === 'true';
      document.body.classList.toggle('dark', storageDark === 'true');
    }
  }

  changeTheme() {
    const isDark = !this.isDark;
    this.isDark = isDark;
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('isDark', isDark.toString());
  }
}
