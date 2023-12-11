import { NgModule } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  home,
  car,
  ellipsisHorizontal,
  contrast,
  moon,
  sunny,
  settings,
  personCircle,
  location,
  trash,
  arrowUndo,
  cash,
  informationCircle,
  arrowUpCircle,
  locate,
  menu,
  wallet,
  logoGoogle,
  logoFacebook,
  logoApple,
  eye,
  eyeOff,
  alertCircle,
  logOut,
} from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';

@NgModule({
  declarations: [],
  imports: [IonIcon],
  exports: [IonIcon],
})
export class IconsModule {
  constructor() {
    addIcons({
      home,
      car,
      ellipsisHorizontal,
      contrast,
      moon,
      sunny,
      settings,
      personCircle,
      location,
      trash,
      arrowUndo,
      cash,
      informationCircle,
      arrowUpCircle,
      locate,
      menu,
      wallet,
      logoGoogle,
      logoFacebook,
      logoApple,
      eye,
      eyeOff,
      alertCircle,
      logOut,
    });
  }
}
