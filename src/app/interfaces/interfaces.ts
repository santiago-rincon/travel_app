export interface Menu {
  title: string;
  icon: string;
  path: string;
}

export interface StaticItems {
  boldText: string;
  normalText: string;
  icon?: {
    name: string;
    slot: Slot;
  };
}

export interface InteractiveItems extends StaticItems {
  itemOptions: ItemOptions[];
  deleted?: boolean;
}

export interface SavedDirections extends InteractiveItems {
  coords: google.maps.LatLngLiteral;
}

export type Slot = 'start' | 'end';

export interface SearchResults {
  direction: string;
  coords: google.maps.LatLngLiteral;
}

export interface TravelDirections {
  target: string;
  coords: google.maps.LatLngLiteral;
}

interface ItemOptions {
  side: Side;
  slideIcon: string;
  color?: Colors;
}

type Side = 'start' | 'end';
type Colors = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'dark' | 'medium';
