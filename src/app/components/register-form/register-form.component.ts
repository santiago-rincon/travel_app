import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShowHidePasswordComponent } from '@components/show-hide-password/show-hide-password.component';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@modules/ionic.module';
import {
  type DriverRegisterSchemaType,
  type RegisterSchemaType,
  driverRegisterShema,
  registerShema,
} from '@schemas/form-checker';
import { ZodError } from 'zod';

@Component({
  standalone: true,
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  imports: [IonicModule, ShowHidePasswordComponent, ReactiveFormsModule],
})
export class RegisterFormComponent {
  private formBuilder = inject(FormBuilder);
  private alertController = inject(AlertController);
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

  submit(form: FormGroup) {
    try {
      const { email, password, passwordRepeated, isDriver } = form.controls;
      const basicData: RegisterSchemaType = registerShema.parse({
        email: email.value,
        password: password.value,
        passwordRepeated: passwordRepeated.value,
        isDriver: isDriver.value,
      });
      try {
        const { names, lastNames, cc, phoneNumber, vehicle, plates } = form.controls;
        let driverData: DriverRegisterSchemaType | undefined = undefined;
        if (basicData.isDriver) {
          driverData = driverRegisterShema.parse({
            names: names.value,
            lastNames: lastNames.value,
            cc: cc.value,
            phoneNumber: phoneNumber.value,
            vehicle: vehicle.value,
            plates: plates.value,
          });
        }
        const finalData = { ...basicData, ...driverData };
        //TODO: Lógica para el registroa
      } catch (error) {
        if (!(error instanceof ZodError)) {
          this.presentAlert('Ha ocurrido un error inesperado');
        } else {
          this.presentAlert(error.issues[0].message);
          const errorField = this.registerForm.get(error.issues[0].path[0] as string);
          errorField?.markAsTouched();
          errorField?.setErrors(Validators.required);
        }
      }
    } catch (error) {
      if (!(error instanceof ZodError)) {
        this.presentAlert('Ha ocurrido un error inesperado');
      } else {
        this.presentAlert(error.issues[0].message);
        const errorField = this.registerForm.get(error.issues[0].path[0] as string);
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
