import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginFormComponent } from '@components/login-form/login-form.component';
import { RegisterFormComponent } from '@components/register-form/register-form.component';
import { SegmentCustomEvent } from '@ionic/angular';
import { IonSegment, ToastController } from '@ionic/angular/standalone';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [IonicModule, IconsModule, LoginFormComponent, RegisterFormComponent],
})
export class LoginComponent implements OnInit {
  private view = signal('login');
  private activedRoute = inject(ActivatedRoute);
  private toastController = inject(ToastController);
  viewSelected = computed(() => this.view());
  @ViewChild(IonSegment) ionSegment!: IonSegment;

  ngOnInit() {
    const params = this.activedRoute.snapshot.paramMap.get('error');
    if (!params) return;
    this.presentToast(params);
  }

  private async presentToast(error: string) {
    const message = error === 'sesion' ? 'Debes iniciar sesión primero' : 'Debes verificar el correo electrónico';
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  handleChange(event: SegmentCustomEvent) {
    this.view.set(event.detail.value === 'login' ? 'login' : 'register');
  }

  changeValue(value: string) {
    this.ionSegment.value = value;
    this.view.set(value);
  }
}
