import { Component, Input } from '@angular/core';
import { IonicModule } from '@modules/ionic.module';

@Component({
  selector: 'app-top-card',
  templateUrl: './top-card.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class TopCardComponent {
  @Input() firstName = 'Usuario';
  @Input() greeting = 'Buen día';
  @Input() avatar = 'assets/icon/avatar.svg';
  @Input() titleApp = 'Título de la App';
  constructor() {}
}
