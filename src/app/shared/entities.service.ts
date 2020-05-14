import { Injectable } from '@angular/core';

export interface Address {
  addressId?: number;
  country: string;
  zone: string;
  city: string;
  street: string;
  building: string;
  office: string;
  zip: string;
}

export interface Station {
  id?: number;
  name?: string;
  addressDTO?: Address;
}

export interface DRMRoute {
  id?: number;
  arrivalStation?: Station;
  departureStation?: Station;
  number: string;
  companyId: number;
  isActive: boolean;
  firstVoyageDate: Date;
  voyageList?: Voyage[];
  stationDTOList: Station[];
}

export interface Voyage {
  id?: number;
  departureDate: Date;
  route: DRMRoute;
  seats: Seat[];
}

export interface Seat {
  id?: number;
  status: SeatStatus;
}

export enum SeatStatus {
  AVAILABLE,
  SOLD,
  RESERVE,
  UNAVAILABLE
}

@Injectable({
  providedIn: 'root'
})
export class EntitiesService {

}
