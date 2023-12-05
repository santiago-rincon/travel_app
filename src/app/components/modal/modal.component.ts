import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchResults } from '@interfaces/interfaces';
import { ModalController } from '@ionic/angular/standalone';
import { IconsModule } from '@modules/icons.module';
import { IonicModule } from '@modules/ionic.module';
import { GoogleMapsService } from '@services/google-maps.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [IonicModule, IconsModule, ReactiveFormsModule],
})
export class ModalComponent implements OnInit, OnDestroy {
  private googleMapsService = inject(GoogleMapsService);
  private modalController = inject(ModalController);
  private googleService = inject(GoogleMapsService);
  private addressSubject$ = new Subject<CustomEvent>();
  private originEmisions = 0;
  private destinationEmisions = 0;
  formBuilder = inject(FormBuilder);
  formDirections!: FormGroup;
  originResults: SearchResults[] = [];
  destinationResults: SearchResults[] = [];
  currentPosition!: google.maps.LatLngLiteral;
  focusTarget: string = '';
  defaultTextResults = 'Busca un lugar...';
  constructor() {}

  ngOnInit(): void {
    this.addressSubject$
      .pipe(
        debounceTime(500),
        distinctUntilChanged((prev, curr) => {
          const prevValue: string = prev.detail.value;
          const currValue: string = curr.detail.value;
          return prevValue.length >= currValue.length && currValue.length !== 0;
        })
      )
      .subscribe(event => {
        const address = event.detail.value;
        const target = (event.target as HTMLInputElement).name;
        this.searchDirection(address, target);
      });
    this.googleMapsService.currentPosition().then(pos => {
      this.currentPosition = pos;
      this.originResults.push({ direction: 'Tu ubicación', coords: pos });
    });
    this.formDirections = this.formBuilder.group({
      origin: '',
      destination: '',
    });
  }

  ngOnDestroy(): void {
    this.addressSubject$.complete();
  }

  handleInput($event: CustomEvent) {
    this.addressSubject$.next($event);
  }

  private async searchDirection(address: string, target: string) {
    if (address === '') {
      if (target === 'origin') {
        this.originResults = [{ direction: 'Tu ubicación', coords: this.currentPosition }];
      } else {
        this.destinationResults = [];
        this.defaultTextResults = 'Busca un lugar...';
      }
      return;
    }
    try {
      const previousResults = target === 'origin' ? this.originResults : this.destinationResults;
      const { results } = await this.googleService.searchDirection(address);
      const directions: google.maps.GeocoderResult = results[0];
      const result: SearchResults = {
        direction: directions.formatted_address,
        coords: { lat: directions.geometry.location.lat(), lng: directions.geometry.location.lng() },
      };
      previousResults.push(result);
      if (target === 'origin') {
        this.originResults = this.deleteDuplicateResults(previousResults);
      } else {
        this.destinationResults = this.deleteDuplicateResults(previousResults);
      }
    } catch (error) {
      this.defaultTextResults = 'No se encontró el lugar';
    }
  }

  closeModal() {
    return this.modalController.dismiss(null, 'close');
  }

  manualUbication() {
    return this.modalController.dismiss(null, 'manual');
  }

  private directionsComplete() {
    return this.modalController.dismiss(null, 'complete');
  }

  selectUbication(direction: string, coords: google.maps.LatLngLiteral) {
    const target = this.focusTarget;
    target === 'origin'
      ? this.formDirections.controls['origin'].setValue(direction)
      : this.formDirections.controls['destination'].setValue(direction);
    target === 'origin' ? this.originEmisions++ : this.destinationEmisions++;
    this.googleMapsService.travel.emit({ target, coords });
    if (this.originEmisions >= 1 && this.destinationEmisions >= 1) this.directionsComplete();
  }

  changeFocus($event: CustomEvent) {
    const target = ($event.target as HTMLInputElement).name;
    const focus = $event.type;
    if (focus === 'ionFocus' && target === 'origin') {
      this.focusTarget = 'origin';
    } else if (focus === 'ionFocus' && target === 'destination') {
      this.focusTarget = 'destination';
    } else {
      this.focusTarget = target;
    }
  }

  private deleteDuplicateResults(results: SearchResults[]): SearchResults[] {
    const uniqueResults: string[] = results.map(result => JSON.stringify(result));
    const uniqueResultsArray = Array.from(new Set(uniqueResults));
    return uniqueResultsArray.map(result => JSON.parse(result));
  }
}
