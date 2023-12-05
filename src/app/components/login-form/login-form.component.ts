import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShowHidePasswordComponent } from '@components/show-hide-password/show-hide-password.component';
import { AlertController } from '@ionic/angular';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';

@Component({
  standalone: true,
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  imports: [IonicModule, ReactiveFormsModule, RouterLink, IconsModule, ShowHidePasswordComponent],
})
export class LoginFormComponent {
  private formBuilder = inject(FormBuilder);
  private alertController = inject(AlertController);
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  submit(form: FormGroup) {
    if (form.invalid) {
      this.presentAlert();
      return;
    }
    console.log(form);
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error en el formulario',
      message: 'Revisa que ingresaste un correo válido y una contraseña con al menos 8 carácteres',
      buttons: ['Ok'],
    });
    await alert.present();
  }

  loginWithProvider(provider: string) {
    console.log(provider);
  }
}
