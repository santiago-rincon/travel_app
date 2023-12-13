import { EventEmitter, Injectable, Output, Renderer2 } from '@angular/core';
import { environment } from 'environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { TravelDirections } from 'app/schemas/interfaces';
import { BehaviorSubject } from 'rxjs';

declare var google: any;
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    initMap?: () => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private apiKey = environment.googleApiKey;
  private isLoadMap = false;
  private geodecoder!: google.maps.Geocoder;
  private directionsService!: google.maps.DirectionsService;
  private directionSaved = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);
  @Output() readonly travel: EventEmitter<TravelDirections> = new EventEmitter();
  @Output() readonly getPosition = new EventEmitter();
  @Output() readonly orderService = new EventEmitter<string>();
  @Output() readonly savedDirection: EventEmitter<google.maps.LatLngLiteral> = new EventEmitter();

  init(render: Renderer2): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isLoadMap) {
        resolve(true);
        return;
      }
      const script: HTMLScriptElement = render.createElement('script');
      script.id = 'google-maps';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&callback=initMap`;
      script.async = true;
      render.appendChild(document.body, script);
      window.initMap = () => {
        this.isLoadMap = true;
        if (google) {
          resolve(true);
        } else {
          reject(new Error('No fue posible cargar el mapa'));
        }
        return;
      };
    });
  }

  searchDirection(address: string): Promise<google.maps.GeocoderResponse> {
    this.geodecoder = new google.maps.Geocoder();
    return this.geodecoder.geocode({ address: address, bounds: environment.boundsSearch }, (results, status) => {
      return { results, status };
    });
  }

  currentPosition(): Promise<google.maps.LatLngLiteral> {
    return Geolocation.getCurrentPosition().then(({ coords }) => {
      return {
        lat: coords.latitude,
        lng: coords.longitude,
      };
    });
  }

  calcRoute(origin: google.maps.LatLng, destination: google.maps.LatLng): Promise<google.maps.DirectionsResult> {
    this.directionsService = new google.maps.DirectionsService();
    const travelMode = google.maps.TravelMode.DRIVING;
    return this.directionsService.route({ origin, destination, travelMode }, (response, status) => {
      return { response, status };
    });
  }

  get directionSavedChanges() {
    return this.directionSaved.asObservable();
  }

  set directionSavedSet(coords: google.maps.LatLngLiteral) {
    this.directionSaved.next(coords);
  }
}
