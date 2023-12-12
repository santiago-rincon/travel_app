import { Component, inject } from '@angular/core';
import { InteractiveListComponent } from '@components/interactive-list/interactive-list.component';
import { TopCardComponent } from '@components/top-card/top-card.component';
import { SavedDirections } from 'app/schemas/interfaces';
import { IonicModule } from '@modules/ionic.module';
import { firstName, directionSaved, titleApp } from '@mooks/data';
import { AuthFireService } from '@services/auth-fire.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [IonicModule, TopCardComponent, InteractiveListComponent],
})
export class HomeComponent {
  private authService = inject(AuthFireService);
  firstName!: string;
  greeting = this.getGreeting();
  avatar!: string;
  titleApp = titleApp;
  directions: SavedDirections[] = directionSaved;
  constructor() {
    const user = this.authService.getUser();
    if (!user) return;
    const { displayName, email } = user;
    if (!email) return;
    this.firstName = displayName?.split(' ')[0] || '...';
    this.avatar =
      `https://ui-avatars.com/api/?name=${displayName}` ||
      `https://ui-avatars.com/api/?name=${email?.split('@')[0]}` ||
      'assets/icon/avatar.svg';
  }

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
