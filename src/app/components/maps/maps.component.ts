/// <reference types="@types/google.maps" />
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { GoogleMapsService } from '@services/google-maps.service';
import { Subscription, interval } from 'rxjs';

declare var google: any;

@Component({
  standalone: true,
  selector: 'app-maps',
  templateUrl: './maps.component.html',
})
export class MapsComponent implements OnInit, OnDestroy {
  private mapOptions: google.maps.MapOptions = {
    center: { lat: 4.342609, lng: -74.3616 },
    zoom: 18,
    disableDefaultUI: true,
    clickableIcons: false,
    rotateControl: true,
  };
  @ViewChild('map') private mapContainer!: ElementRef;
  private map!: google.maps.Map;
  private originMarker!: google.maps.Marker;
  private destinationMarker!: google.maps.Marker;
  private directionsDisplay!: google.maps.DirectionsRenderer;
  private render = inject(Renderer2);
  private googleMapsService = inject(GoogleMapsService);
  private subUpdatePosition!: Subscription;
  ngOnInit(): void {
    console.log('Maps loading');
    this.loadScript();
    this.googleMapsService.travel.subscribe(travelDirections => {
      const { target, coords } = travelDirections;
      this.updatePositionMarkers(target === 'origin' ? this.originMarker : this.destinationMarker, coords);
    });
    this.googleMapsService.getPosition.subscribe(() => this.adapScreen());
    this.googleMapsService.orderService.subscribe(() => this.orderService());
  }

  private async loadScript() {
    try {
      const res = await this.googleMapsService.init(this.render);
      if (res) {
        this.initMap();
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async initMap() {
    const currentPosition = await this.googleMapsService.currentPosition();
    this.mapOptions.center = currentPosition;
    this.map = new google.maps.Map(this.mapContainer.nativeElement, this.mapOptions);
    const originMarkerOptions: google.maps.MarkerOptions = {
      position: this.mapOptions.center,
      map: this.map,
      title: 'Mi ubicación',
      icon: 'assets/icon/user.webp',
      animation: google.maps.Animation.DROP,
      draggable: true,
    };
    const destinationMarkerOptions: google.maps.MarkerOptions = {
      position: {
        lat: this.mapOptions.center.lat + 0.0007,
        lng: this.mapOptions.center.lng + 0.0003,
      },
      map: this.map,
      title: 'Mi ubicación',
      icon: 'assets/icon/flag.webp',
      animation: google.maps.Animation.DROP,
      draggable: true,
    };
    this.originMarker = new google.maps.Marker(originMarkerOptions);
    this.destinationMarker = new google.maps.Marker(destinationMarkerOptions);
    const infowindowOrigin: google.maps.InfoWindow = new google.maps.InfoWindow({
      content: '<h1 class="text-lg font-bold pt-[2px] pe-[10px] pb-[10px] ps-0">Mi ubicación</h1>',
    });
    const infowindowDestination: google.maps.InfoWindow = new google.maps.InfoWindow({
      content: '<h1 class="text-lg font-bold pt-[2px] pe-[10px] pb-[10px] ps-0">Destino</h1>',
    });
    this.originMarker.addListener('click', () => {
      infowindowOrigin.open({ map: this.map, anchor: this.originMarker });
    });
    this.destinationMarker.addListener('click', () => {
      infowindowDestination.open({ map: this.map, anchor: this.destinationMarker });
    });
    this.googleMapsService.directionSavedChanges.subscribe(coords => {
      if (coords === null) return;
      this.updatePositionMarkers(this.destinationMarker, coords);
    });
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setOptions({ suppressMarkers: true });
    this.subUpdatePosition = interval(3000).subscribe(async () => {
      const currentPosition = await this.googleMapsService.currentPosition();
      this.updatePositionMarkers(this.originMarker, currentPosition, false);
    });
  }

  ngOnDestroy() {
    this.subUpdatePosition.unsubscribe();
  }

  private updatePositionMarkers(marker: google.maps.Marker, position: google.maps.LatLngLiteral, adapScreen = true) {
    marker.setPosition(position);
    if (adapScreen) setTimeout(() => this.adapScreen(), 500);
  }

  private adapScreen() {
    const bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();
    bounds.extend(this.originMarker.getPosition() as google.maps.LatLng);
    bounds.extend(this.destinationMarker.getPosition() as google.maps.LatLng);
    this.map.setCenter(bounds.getCenter());
    this.map.fitBounds(bounds);
  }

  private async orderService() {
    const origin = this.originMarker.getPosition() as google.maps.LatLng;
    const destination = this.destinationMarker.getPosition() as google.maps.LatLng;
    try {
      const response = await this.googleMapsService.calcRoute(origin, destination);
      this.directionsDisplay.setDirections(response);
    } catch (error) {
      console.log('Fallo la promesa');
    }
  }
}
