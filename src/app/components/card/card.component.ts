import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-card',
  templateUrl: './card.component.html',
  imports: [RouterLink],
})
export class CardComponent {
  @Input() title: string = 'Título';
  @Input({ required: true }) img!: string;
  @Input({ required: true }) alt!: string;
  @Input({ required: true }) path: string = '/';
  @Input() params = {};
}
