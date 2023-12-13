import { Component, ContentChild, Input } from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';
import { IconsModule } from '@modules/icons.module';

@Component({
  standalone: true,
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  imports: [IconsModule],
})
export class ShowHidePasswordComponent {
  @ContentChild(IonInput) input!: IonInput;
  showPassword = false;
  @Input() showButton: boolean = false;
  toggleShow() {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }
}
