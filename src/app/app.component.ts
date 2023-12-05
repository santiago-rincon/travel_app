import { Component } from '@angular/core';
import { MenuComponent } from '@components/menu/menu.component';
import { TabsComponent } from '@components/tabs/tabs.component';
import { IonicModule } from '@ionic/angular';
import { titleApp } from '@mooks/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [MenuComponent, TabsComponent, IonicModule],
})
export class AppComponent {
  titleApp = titleApp;
  constructor() {}
}
