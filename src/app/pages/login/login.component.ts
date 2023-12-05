import { Component } from '@angular/core';
import { LoginFormComponent } from '@components/login-form/login-form.component';
import { RegisterFormComponent } from '@components/register-form/register-form.component';
import { SegmentCustomEvent } from '@ionic/angular';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [IonicModule, IconsModule, LoginFormComponent, RegisterFormComponent],
})
export class LoginComponent {
  viewSelected = 'login';

  handleChange(e: SegmentCustomEvent) {
    this.viewSelected = e.detail.value === 'login' ? 'login' : 'register';
  }
}
