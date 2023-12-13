import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit, Renderer2, inject } from '@angular/core';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';
import { Menu } from 'app/schemas/interfaces';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuController } from '@ionic/angular/standalone';
import { TabsComponent } from '@components/tabs/tabs.component';
import { AuthFireService } from '@services/auth-fire.service';

@Component({
  standalone: true,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  imports: [IconsModule, IonicModule, FormsModule, RouterLink, RouterLinkActive, TabsComponent],
})
export class MenuComponent implements OnInit {
  @Input() titleApp = 'Título de la App';
  private menuCtrl = inject(MenuController);
  private authService = inject(AuthFireService);
  private render = inject(Renderer2);
  isDark = false;
  menusLgScreen: Menu[] = [
    { title: 'Inicio', icon: 'home', path: 'home', onClick: () => this.menuCtrl.toggle('main-menu') },
    { title: 'Viajar', icon: 'car', path: 'travel', onClick: () => this.menuCtrl.toggle('main-menu') },
  ];
  menus: Menu[] = [
    { title: 'Perfil', icon: 'person-circle', path: 'profile', onClick: () => this.menuCtrl.toggle('main-menu') },
    { title: 'Tarifas', icon: 'cash', path: 'rates', onClick: () => this.menuCtrl.toggle('main-menu') },
    {
      title: 'Información',
      icon: 'information-circle',
      path: 'information',
      onClick: () => this.menuCtrl.toggle('main-menu'),
    },
    { title: 'Cerrar sesión', icon: 'log-out', onClick: () => this.signOut() },
  ];

  ngOnInit() {
    const storageDark = localStorage.getItem('isDark');
    if (storageDark === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      const dark = prefersDark.matches;
      this.isDark = dark;
      dark ? this.render.addClass(document.body, 'dark') : this.render.removeClass(document.body, 'dark');
      localStorage.setItem('isDark', dark.toString());
    } else {
      this.isDark = storageDark === 'true';
      storageDark === 'true'
        ? this.render.addClass(document.body, 'dark')
        : this.render.removeClass(document.body, 'dark');
    }
  }

  changeTheme() {
    const isDark = !this.isDark;
    this.isDark = isDark;
    isDark ? this.render.addClass(document.body, 'dark') : this.render.removeClass(document.body, 'dark');
    localStorage.setItem('isDark', isDark.toString());
  }

  signOut() {
    this.menuCtrl.toggle('main-menu');
    this.authService.signOut();
  }
}
