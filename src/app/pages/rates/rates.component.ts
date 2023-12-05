import { Component } from '@angular/core';
import { ListComponent } from '@components/list/list.component';
import { StaticItems } from '@interfaces/interfaces';
import { IonicModule } from '@modules/ionic.module';
import { rates2023 } from '@mooks/data';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  standalone: true,
  imports: [IonicModule, ListComponent],
})
export class RatesComponent {
  ratesService: StaticItems[] = rates2023;
  year = new Date().getFullYear();
}
