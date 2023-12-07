import { Component } from '@angular/core';
import { InteractiveListComponent } from '@components/interactive-list/interactive-list.component';
import { TopCardComponent } from '@components/top-card/top-card.component';
import { SavedDirections } from 'app/schemas/interfaces';
import { IonicModule } from '@modules/ionic.module';
import { firstName, directionSaved, titleApp } from '@mooks/data';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [IonicModule, TopCardComponent, InteractiveListComponent],
})
export class HomeComponent {
  firstName = firstName;
  greeting = this.getGreeting();
  avatar: string = `https://ui-avatars.com/api/?name=${firstName}`;
  titleApp = titleApp;
  directions: SavedDirections[] = directionSaved;
  constructor() {}

  getGreeting(): string {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
      return 'Buenos días';
    } else if (hour < 18) {
      return 'Buenas tardes';
    }
    return 'Buenas noches';
  }
}
