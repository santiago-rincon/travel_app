import { InteractiveItems, SavedDirections, StaticItems } from '@interfaces/interfaces';
export const titleApp = 'Travel App';

export const firstName = 'Santiago';

export const directionSaved: SavedDirections[] = [
  {
    boldText: 'Casa',
    normalText: 'Diagonal 16D #2B - 40',
    coords: { lat: 4.332250503300504, lng: -74.36033903511958 },
    icon: { name: 'location', slot: 'start' },
    itemOptions: [{ side: 'end', slideIcon: 'trash', color: 'danger' }],
  },
  {
    boldText: 'Terminal',
    normalText: 'Terminal fusagasugá',
    coords: { lat: 4.345871875139092, lng: -74.37774237092967 },
    icon: { name: 'location', slot: 'start' },
    itemOptions: [{ side: 'end', slideIcon: 'trash', color: 'danger' }],
  },
  {
    boldText: 'Universidad',
    normalText: 'Udec',
    coords: { lat: 4.333953727447274, lng: -74.36945862933464 },
    icon: { name: 'location', slot: 'start' },
    itemOptions: [{ side: 'end', slideIcon: 'trash', color: 'danger' }],
  },
  {
    boldText: 'Plaza',
    normalText: 'Plaza de mercado',
    coords: { lat: 4.341509228694473, lng: -74.36503463224793 },
    icon: { name: 'location', slot: 'start' },
    itemOptions: [{ side: 'end', slideIcon: 'trash', color: 'danger' }],
  },
];

export const rates2023: StaticItems[] = [
  { boldText: 'Perímetro urbano', normalText: '$7000' },
  { boldText: 'Villa Aranzu', normalText: '$7500' },
  { boldText: 'Ladrillera', normalText: '$7500' },
  { boldText: 'Palmar de manila', normalText: '$7500' },
  { boldText: 'Indio Gran Colombia', normalText: '$7500' },
  { boldText: 'Camino real', normalText: '$8000' },
  { boldText: 'Perímetro urbano', normalText: '$7000' },
  { boldText: 'Villa Aranzu', normalText: '$7500' },
  { boldText: 'Ladrillera', normalText: '$7500' },
  { boldText: 'Palmar de manila', normalText: '$7500' },
  { boldText: 'Indio Gran Colombia', normalText: '$7500' },
  { boldText: 'Camino real', normalText: '$8000' },
  { boldText: 'Perímetro urbano', normalText: '$7000' },
  { boldText: 'Villa Aranzu', normalText: '$7500' },
  { boldText: 'Ladrillera', normalText: '$7500' },
  { boldText: 'Palmar de manila', normalText: '$7500' },
  { boldText: 'Indio Gran Colombia', normalText: '$7500' },
  { boldText: 'Camino real', normalText: '$8000' },
  { boldText: 'Perímetro urbano', normalText: '$7000' },
  { boldText: 'Villa Aranzu', normalText: '$7500' },
  { boldText: 'Ladrillera', normalText: '$7500' },
  { boldText: 'Palmar de manila', normalText: '$7500' },
  { boldText: 'Indio Gran Colombia', normalText: '$7500' },
  { boldText: 'Camino real', normalText: '$8000' },
];
