import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShowHidePasswordComponent } from '@components/show-hide-password/show-hide-password.component';
import { LoadingController } from '@ionic/angular/standalone';
import { IonicModule } from '@modules/ionic.module';
import { driverRegisterShema, registerShema } from '@schemas/form-checker';
import { AlertsService } from '@services/alerts.service';
import { AuthFireService } from '@services/auth-fire.service';
import { ZodError } from 'zod';

@Component({
  standalone: true,
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  imports: [IonicModule, ShowHidePasswordComponent, ReactiveFormsModule],
})
export class RegisterFormComponent {
  @Output() readonly segment = new EventEmitter<string>();
  private formBuilder = inject(FormBuilder);
  private alertsService = inject(AlertsService);
  private authService = inject(AuthFireService);
  private loadingController = inject(LoadingController);
  private readonly alertParams = { header: 'Error en el registro' };
  registerForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordRepeated: ['', [Validators.required, Validators.minLength(8)]],
    isDriver: [false],
    names: [''],
    lastNames: [''],
    cc: [''],
    phoneNumber: [''],
    vehicle: [''],
    plates: [''],
  });

  async submit(form: FormGroup) {
    try {
      const { email, password, passwordRepeated, isDriver } = form.controls;
      registerShema.parse({
        email: email.value,
        password: password.value,
        passwordRepeated: passwordRepeated.value,
        isDriver: isDriver.value,
      });
      try {
        const { names, lastNames, cc, phoneNumber, vehicle, plates } = form.controls;
        if (isDriver.value) {
          driverRegisterShema.parse({
            names: names.value,
            lastNames: lastNames.value,
            cc: cc.value,
            phoneNumber: phoneNumber.value,
            vehicle: vehicle.value,
            plates: plates.value,
          });
        }
        this.registerUser({ email: email.value, password: password.value, isDriver: isDriver.value });
      } catch (error) {
        if (!(error instanceof ZodError)) {
          this.alertsService.presentAlert({ ...this.alertParams, message: 'Ha ocurrido un error inesperado' });
        } else {
          this.alertsService.presentAlert({ ...this.alertParams, message: error.issues[0].message });
          const errorField = this.registerForm.get(error.issues[0].path[0] as string);
          errorField?.markAsTouched();
          errorField?.setErrors(Validators.required);
        }
      }
    } catch (error) {
      if (!(error instanceof ZodError)) {
        this.alertsService.presentAlert({ ...this.alertParams, message: 'Ha ocurrido un error inesperado' });
      } else {
        this.alertsService.presentAlert({ ...this.alertParams, message: error.issues[0].message });
        const errorField = this.registerForm.get(error.issues[0].path[0] as string);
        errorField?.markAsTouched();
        errorField?.setErrors(Validators.required);
      }
    }
  }

  private async registerUser({ email, password, isDriver }: { email: string; password: string; isDriver: boolean }) {
    const loader = await this.loadingController.create({
      animated: true,
      message: 'Creando cuenta...',
      spinner: 'dots',
    });
    loader.present();
    try {
      const { user } = await this.authService.registerWithEmail(email, password);
      await this.authService.sendEmailToVerification(user);
      if (isDriver) {
        //TODO Registrar los datos extras en FireStore
      }
      this.registerForm.reset();
      loader.dismiss();
      this.alertsService.presentAlert({ header: 'Registro exitoso', message: 'Verifica tu correo' });
      this.segment.emit('login');
    } catch (error) {
      loader.dismiss();
      if (error instanceof FirebaseError) {
        this.registerForm.reset();
        const message = this.authService.verifyErrorCodes(error.code);
        this.alertsService.presentAlert({ ...this.alertParams, message });
      }
    }
  }

  onToggleChange(checked: boolean) {
    const requiredFields = [
      { controlName: 'names', validators: [Validators.required] },
      { controlName: 'lastNames', validators: [Validators.required] },
      {
        controlName: 'cc',
        validators: [Validators.required, Validators.maxLength(12), Validators.pattern(/^\d{1,12}$/)],
      },
      {
        controlName: 'phoneNumber',
        validators: [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(/^3\d{9}$/),
        ],
      },
      { controlName: 'vehicle', validators: [Validators.required, Validators.pattern(/^(carro|moto)$/i)] },
      {
        controlName: 'plates',
        // eslint-disable-next-line prettier/prettier
        validators: [
          Validators.required,
          Validators.maxLength(6),
          Validators.pattern(/^(?:[a-zA-Z]{3}\d{3}|[a-zA-Z]{3}\d{2}[a-zA-Z])$/),
        ],
      },
    ];
    requiredFields.forEach(fieldName => {
      const field = this.registerForm.get(fieldName.controlName);
      checked ? field?.setValidators(fieldName.validators) : field?.clearValidators();
      field?.updateValueAndValidity();
    });
  }
}
