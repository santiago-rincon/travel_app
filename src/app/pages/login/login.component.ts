import { Component, ViewChild, computed, signal } from '@angular/core';
import { LoginFormComponent } from '@components/login-form/login-form.component';
import { RegisterFormComponent } from '@components/register-form/register-form.component';
import { SegmentCustomEvent } from '@ionic/angular';
import { IonSegment } from '@ionic/angular/standalone';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [IonicModule, IconsModule, LoginFormComponent, RegisterFormComponent],
})
export class LoginComponent {
  private view = signal('register');
  viewSelected = computed(() => this.view());
  @ViewChild(IonSegment) ionSegment!: IonSegment;

  handleChange(event: SegmentCustomEvent) {
    this.view.set(event.detail.value === 'login' ? 'login' : 'register');
  }

  changeValue(value: string) {
    this.ionSegment.value = value;
    this.view.set(value);
  }
}
