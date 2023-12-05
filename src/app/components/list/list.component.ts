import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaticItems } from '@interfaces/interfaces';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';

@Component({
  standalone: true,
  selector: 'app-list',
  templateUrl: './list.component.html',
  imports: [IonicModule, IconsModule, RouterLink],
})
export class ListComponent {
  @Input() title = 'Título';
  @Input() voidData = 'Texto cuando el array de datos está vacío';
  @Input() items: StaticItems[] = [];
  constructor() {}
}
