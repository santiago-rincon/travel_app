import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '@components/card/card.component';
import { InteractiveListComponent } from '@components/interactive-list/interactive-list.component';
import { directionSaved } from '@mooks/data';
import { SavedDirections } from '@schemas/interfaces';

@Component({
  standalone: true,
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  imports: [InteractiveListComponent, RouterLink, CardComponent],
})
export class UserHomeComponent {
  directions: SavedDirections[] = directionSaved;
}
