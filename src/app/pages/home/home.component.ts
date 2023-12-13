import { Component, OnInit, inject } from '@angular/core';
import { InteractiveListComponent } from '@components/interactive-list/interactive-list.component';
import { TopCardComponent } from '@components/top-card/top-card.component';
import { SavedDirections } from 'app/schemas/interfaces';
import { IonicModule } from '@modules/ionic.module';
import { directionSaved, titleApp } from '@mooks/data';
import { AuthFireService } from '@services/auth-fire.service';
import { FirestoreService } from '@services/firestore.service';
import { type DriverUserFirestoreType } from '@schemas/form-checker';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [IonicModule, TopCardComponent, InteractiveListComponent, RouterLink],
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthFireService);
  private firestoreService = inject(FirestoreService);
  private isDriver!: boolean;
  firstName!: string;
  greeting = this.getGreeting();
  avatar!: string;
  titleApp = titleApp;
  directions: SavedDirections[] = directionSaved;
  ngOnInit() {
    this.getRole();
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

  private async getRole() {
    const localData = localStorage.getItem('profile');
    if (localData) {
      console.log('Storage');
      const { firstName, avatar } = JSON.parse(localData);
      this.firstName = firstName;
      this.avatar = avatar;
      return;
    }
    console.log('Peticiones');
    const user = this.authService.getUser();
    if (!user) return;
    const { displayName, email, uid } = user;
    const res = await this.firestoreService.getDataById(uid, 'drivers');
    if (res.exists()) {
      const { names } = res.data() as DriverUserFirestoreType;
      const alternativeName = names.split(' ')[0];
      const firstName = displayName?.split(' ')[0] || alternativeName;
      const avatar =
        (displayName && `https://ui-avatars.com/api/?name=${displayName}`) ||
        `https://ui-avatars.com/api/?name=${alternativeName}`;
      this.firstName = firstName;
      this.avatar = avatar;
      localStorage.setItem('profile', JSON.stringify({ firstName, avatar }));
    } else {
      const firstName = displayName?.split(' ')[0] || '...';
      const avatar =
        (displayName && `https://ui-avatars.com/api/?name=${displayName}`) ||
        `https://ui-avatars.com/api/?name=${email?.split('@')[0]}`;
      this.firstName = firstName;
      this.avatar = avatar;
      localStorage.setItem('profile', JSON.stringify({ firstName, avatar }));
    }
  }
}
