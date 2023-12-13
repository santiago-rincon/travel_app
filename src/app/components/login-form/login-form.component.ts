import { Component, EventEmitter, Output, QueryList, ViewChildren, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShowHidePasswordComponent } from '@components/show-hide-password/show-hide-password.component';
import { IonInput, LoadingController } from '@ionic/angular/standalone';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';
import { loginSchema } from '@schemas/form-checker';
import { AlertsService } from '@services/alerts.service';
import { AuthFireService } from '@services/auth-fire.service';
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
  private alertsService = inject(AlertsService);
  private authService = inject(AuthFireService);
  private loadingController = inject(LoadingController);
  private router = inject(Router);
  private readonly alertParams = { header: 'Error en el inicio de sesión' };
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(form: FormGroup) {
    try {
      const { email, password } = form.controls;
      loginSchema.parse({ email: email.value, password: password.value });
      this.loginwithEmai({ email: email.value, password: password.value });
    } catch (error) {
      if (!(error instanceof ZodError)) {
        this.alertsService.presentAlert({ ...this.alertParams, message: 'Ha ocurrido un error inesperado' });
      } else {
        this.alertsService.presentAlert({ ...this.alertParams, message: error.issues[0].message });
        const errorField = this.loginForm.get(error.issues[0].path[0] as string);
        errorField?.markAsTouched();
        errorField?.setErrors(Validators.required);
      }
    }
  }

  async loginWithGoogle() {
    const loader = await this.loadingController.create({
      animated: true,
      message: 'Iniciando sesión...',
      spinner: 'dots',
    });
    loader.present();
    try {
      const res = await this.authService.signInWithGoogle();
      if (!res) {
        loader.dismiss();
        return;
      }
      loader.dismiss();
      this.router.navigate(['home']);
    } catch (error) {
      loader.dismiss();
      if (error instanceof FirebaseError) {
        const message = this.authService.verifyErrorCodes(error.code);
        this.alertsService.presentAlert({ ...this.alertParams, message });
      }
    }
  }

  private async loginwithEmai({ email, password }: { email: string; password: string }) {
    const loader = await this.loadingController.create({
      animated: true,
      message: 'Iniciando sesión...',
      spinner: 'dots',
    });
    loader.present();
    try {
      await this.authService.signInwithEmail(email, password);
      this.loginForm.reset();
      loader.dismiss();
      this.router.navigate(['home']);
    } catch (error) {
      loader.dismiss();
      if (error instanceof FirebaseError) {
        const message = this.authService.verifyErrorCodes(error.code);
        this.alertsService.presentAlert({ ...this.alertParams, message });
      }
    }
  }
}
