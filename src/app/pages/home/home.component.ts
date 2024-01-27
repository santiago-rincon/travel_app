import { Component, OnInit, inject } from '@angular/core';
import { TopCardComponent } from '@components/top-card/top-card.component';
import { titleApp } from '@mooks/data';
import { AuthFireService } from '@services/auth-fire.service';
import { FirestoreService } from '@services/firestore.service';
import { type DriverUserFirestoreType } from '@schemas/form-checker';
import { UserHomeComponent } from '@components/user-home/user-home.component';
import { DriverHomeComponent } from '@components/driver-home/driver-home.component';
import { IonContent, IonProgressBar } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [IonContent, IonProgressBar, TopCardComponent, UserHomeComponent, DriverHomeComponent],
})
export class HomeComponent implements OnInit {
  authService = inject(AuthFireService);
  private firestoreService = inject(FirestoreService);
  userType = this.authService.getRole;
  firstName = 'usuario';
  greeting = this.getGreeting();
  avatar = 'assets/icon/avatar.svg';
  titleApp = titleApp;
  ngOnInit() {
    this.getInfoUsr();
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

  private async getInfoUsr() {
    const localData = localStorage.getItem('profile');
    if (localData) {
      console.log('Storage');
      const { firstName, avatar, role } = JSON.parse(localData);
      this.firstName = firstName;
      this.avatar = avatar;
      this.authService.setRole = role;
      return;
    }
    console.log('Peticiones');
    const user = this.authService.getUser();
    if (!user) return;
    const { displayName, email, uid } = user;
    const res = await this.firestoreService.getDataById(uid, 'drivers');
    if (res.exists()) {
      const role = 'driver';
      this.authService.setRole = role;
      const { names } = res.data() as DriverUserFirestoreType;
      const alternativeName = names.split(' ')[0];
      const firstName = displayName?.split(' ')[0] || alternativeName;
      const avatar =
        (displayName && `https://ui-avatars.com/api/?name=${displayName}`) ||
        `https://ui-avatars.com/api/?name=${alternativeName}`;
      this.firstName = firstName;
      this.avatar = avatar;
      localStorage.setItem('profile', JSON.stringify({ firstName, avatar, role }));
    } else {
      const role = 'user';
      this.authService.setRole = role;
      const firstName = displayName?.split(' ')[0] || '...';
      const avatar =
        (displayName && `https://ui-avatars.com/api/?name=${displayName}`) ||
        `https://ui-avatars.com/api/?name=${email?.split('@')[0]}`;
      this.firstName = firstName;
      this.avatar = avatar;
      localStorage.setItem('profile', JSON.stringify({ firstName, avatar, role }));
    }
  }
}
