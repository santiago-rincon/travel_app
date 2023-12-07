import { Component, EventEmitter, Output, QueryList, ViewChildren, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShowHidePasswordComponent } from '@components/show-hide-password/show-hide-password.component';
import { AlertController } from '@ionic/angular';
import { IonInput } from '@ionic/angular/standalone';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';
import { type LoginSchemaType, loginSchema } from '@schemas/form-checker';
import { ZodError } from 'zod';

@Component({
  standalone: true,
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  imports: [IonicModule, ReactiveFormsModule, RouterLink, IconsModule, ShowHidePasswordComponent],
})
export class LoginFormComponent {
  @Output() readonly segment = new EventEmitter<string>();
  @ViewChildren('inputFields') inputFields!: QueryList<IonInput>;
  private formBuilder = inject(FormBuilder);
  private alertController = inject(AlertController);
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(form: FormGroup) {
    try {
      const { email, password } = form.controls;
      const data: LoginSchemaType = loginSchema.parse({ email: email.value, password: password.value });
      //TODO: Lógica para el inicio de sesión
    } catch (error) {
      if (!(error instanceof ZodError)) {
        this.presentAlert('Ha ocurrido un error inesperado');
      } else {
        this.presentAlert(error.issues[0].message);
        const errorField = this.loginForm.get(error.issues[0].path[0] as string);
        errorField?.markAsTouched();
        errorField?.setErrors(Validators.required);
      }
    }
  }

  private async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error en el formulario',
      message,
      buttons: ['Ok'],
    });
    await alert.present();
  }

  loginWithProvider(provider: string) {
    console.log(provider);
  }
}
