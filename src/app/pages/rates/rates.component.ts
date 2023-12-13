import { Component, computed, signal } from '@angular/core';
import { ListComponent } from '@components/list/list.component';
import { IonicModule } from '@modules/ionic.module';
import { rates2023 } from '@mooks/data';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  standalone: true,
  imports: [IonicModule, ListComponent],
})
export class RatesComponent {
  private rates = signal(rates2023);
  ratesService = computed(() => this.rates());
  year = new Date().getFullYear();

  handleChange(e: CustomEvent) {
    const { value } = e.detail;
    if (value === 'Carro') {
      this.rates.set(rates2023);
    } else {
      this.rates.set([{ boldText: 'Gran colombia', normalText: '$5.000' }]);
    }
  }
}
