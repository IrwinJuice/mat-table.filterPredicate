import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {DRMRoute, Seat, SeatStatus, Station, Voyage} from '../shared/entities.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {from, Observable} from 'rxjs';
import {distinct, map, mergeMap, startWith, toArray} from 'rxjs/operators';

@Component({
  selector: 'app-voyage-search-panel',
  templateUrl: './voyage-search-panel.component.html',
  styleUrls: ['./voyage-search-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoyageSearchPanelComponent implements OnInit {
  public displayedColumns: string[] =
    ['departureDate', 'departureStation', 'arrivalStation', 'available', 'sold', 'reserve', 'unavailable'];
  public dataSource: MatTableDataSource<Voyage>;

  public searchForm: FormGroup;
  public departureDate = '';
  public arrivalStation = '';
  public departureStation = '';


  constructor() {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(VOYAGES);
    this.searchFormInit();
    /* Filter predicate used for filtering table per different columns
    *  */
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }

  searchFormInit() {
    this.searchForm = new FormGroup({
      arrivalStation: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      departureStation: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      departureDate: new FormControl('')
    });
  }

  /* this method well be called for each row in table  */
  getFilterPredicate() {
    return (row: Voyage, filters: string) => {
      // split string per '$' to array
      const filterArray = filters.split('$');
      const departureDate = filterArray[0];
      const departureStation = filterArray[1];
      const arrivalStation = filterArray[2];

      const matchFilter = [];

      // Fetch data from row
      const columnDepartureDate = row.departureDate;
      const columnDepartureStation = row.route.departureStation.name;
      const columnArrivalStation = row.route.arrivalStation.name;

      // verify fetching data by our searching values
      const customFilterDD = columnDepartureDate.toDateString().toLowerCase().includes(departureDate);
      const customFilterDS = columnDepartureStation.toLowerCase().includes(departureStation);
      const customFilterAS = columnArrivalStation.toLowerCase().includes(arrivalStation);

      // push boolean values into array
      matchFilter.push(customFilterDD);
      matchFilter.push(customFilterDS);
      matchFilter.push(customFilterAS);

      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }

  applyFilter() {
    const date = this.searchForm.get('departureDate').value;
    const as = this.searchForm.get('arrivalStation').value;
    const ds = this.searchForm.get('departureStation').value;

    this.departureDate = (date === null || date === '') ? '' : date.toDateString();
    this.arrivalStation = as === null ? '' : as;
    this.departureStation = ds === null ? '' : ds;

    // create string of our searching values and split if by '$'
    const filterValue = this.departureDate + '$' + this.departureStation + '$' + this.arrivalStation;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  availableSeats(seats: Seat[]): number {
    return seats.filter(seat => seat.status === SeatStatus.AVAILABLE).length;
  }

  unavailableSeats(seats: Seat[]): number {
    return seats.filter(seat => seat.status === SeatStatus.UNAVAILABLE).length;
  }

  soldSeats(seats: Seat[]): number {
    return seats.filter(seat => seat.status === SeatStatus.SOLD).length;
  }

  reserveSeats(seats: Seat[]): number {
    return seats.filter(seat => seat.status === SeatStatus.RESERVE).length;
  }
}

const STATION: Station[] = [
  {id: 1, name: 'Kyiv'},
  {id: 2, name: 'Kharkiv'},
  {id: 3, name: 'Lviv'},
  {id: 4, name: 'Poltava'},
  {id: 5, name: 'Odesa'},
  {id: 6, name: 'Sumy'},
  {id: 7, name: 'Uzhhorod'},
  {id: 8, name: 'Fastiv'},
  {id: 9, name: 'Kharkiv'}
];

const ROUTE_K_D: DRMRoute = {
  companyId: 1,
  firstVoyageDate: new Date(),
  id: 1,
  isActive: false,
  departureStation: STATION[0],
  arrivalStation: STATION[1],
  number: '',
  voyageList: [],
  stationDTOList: [STATION[0], STATION[1], STATION[4]]
};
const ROUTE_P_S: DRMRoute = {
  companyId: 1,
  firstVoyageDate: new Date(),
  id: 1,
  isActive: false,
  departureStation: STATION[3],
  arrivalStation: STATION[5],
  number: '',
  voyageList: [],
  stationDTOList: [STATION[3], STATION[4], STATION[5]]
};

const ROUTE_U_K: DRMRoute = {
  companyId: 1,
  firstVoyageDate: new Date(),
  id: 1,
  isActive: false,
  departureStation: STATION[6],
  arrivalStation: STATION[8],
  number: '',
  voyageList: [],
  stationDTOList: [STATION[6], STATION[7], STATION[8]]
};
const ROUTE_L_K: DRMRoute = {
  companyId: 1,
  firstVoyageDate: new Date(),
  id: 2,
  isActive: false,
  arrivalStation: STATION[3],
  departureStation: STATION[2],
  number: '',
  voyageList: [],
  stationDTOList: [STATION[2], STATION[3]]
};

const SEATS_K_D: Seat[] = [
  {id: 1, status: SeatStatus.AVAILABLE},
  {id: 2, status: SeatStatus.AVAILABLE},
  {id: 3, status: SeatStatus.AVAILABLE},
  {id: 4, status: SeatStatus.AVAILABLE},
  {id: 5, status: SeatStatus.AVAILABLE},
  {id: 6, status: SeatStatus.AVAILABLE},
  {id: 7, status: SeatStatus.AVAILABLE},
  {id: 8, status: SeatStatus.UNAVAILABLE},
  {id: 9, status: SeatStatus.UNAVAILABLE},
  {id: 10, status: SeatStatus.SOLD},
  {id: 11, status: SeatStatus.SOLD},
  {id: 12, status: SeatStatus.RESERVE},
];
const SEATS_L_K: Seat[] = [
  {id: 13, status: SeatStatus.AVAILABLE},
  {id: 14, status: SeatStatus.AVAILABLE},
  {id: 15, status: SeatStatus.AVAILABLE},
  {id: 16, status: SeatStatus.AVAILABLE},
  {id: 17, status: SeatStatus.AVAILABLE},
  {id: 18, status: SeatStatus.UNAVAILABLE},
  {id: 19, status: SeatStatus.UNAVAILABLE},
  {id: 20, status: SeatStatus.SOLD},
  {id: 21, status: SeatStatus.SOLD},
  {id: 22, status: SeatStatus.RESERVE},
];

const VOYAGES: Voyage[] = [
  {id: 1, departureDate: new Date('2020-01-16'), route: ROUTE_P_S, seats: SEATS_K_D},
  {id: 2, departureDate: new Date('2020-01-16'), route: ROUTE_L_K, seats: SEATS_L_K},
  {id: 3, departureDate: new Date('2020-01-17'), route: ROUTE_K_D, seats: SEATS_K_D},
  {id: 4, departureDate: new Date('2020-01-17'), route: ROUTE_L_K, seats: SEATS_L_K},
  {id: 5, departureDate: new Date('2020-01-19'), route: ROUTE_U_K, seats: SEATS_K_D},
  {id: 6, departureDate: new Date('2020-01-19'), route: ROUTE_L_K, seats: SEATS_L_K},
  {id: 7, departureDate: new Date('2020-01-20'), route: ROUTE_K_D, seats: SEATS_K_D},
  {id: 8, departureDate: new Date('2020-01-20'), route: ROUTE_P_S, seats: SEATS_L_K},
  {id: 9, departureDate: new Date('2020-01-22'), route: ROUTE_U_K, seats: SEATS_K_D},
  {id: 11, departureDate: new Date('2020-01-22'), route: ROUTE_L_K, seats: SEATS_L_K},
  {id: 12, departureDate: new Date('2020-01-24'), route: ROUTE_K_D, seats: SEATS_K_D},
  {id: 13, departureDate: new Date('2020-01-24'), route: ROUTE_L_K, seats: SEATS_L_K},
  {id: 14, departureDate: new Date('2020-01-26'), route: ROUTE_K_D, seats: SEATS_K_D},
  {id: 15, departureDate: new Date('2020-01-26'), route: ROUTE_L_K, seats: SEATS_L_K},
  {id: 16, departureDate: new Date('2020-01-28'), route: ROUTE_U_K, seats: SEATS_K_D},
  {id: 17, departureDate: new Date('2020-01-28'), route: ROUTE_L_K, seats: SEATS_L_K},
  {id: 18, departureDate: new Date('2020-01-27'), route: ROUTE_P_S, seats: SEATS_K_D},
  {id: 19, departureDate: new Date('2020-01-27'), route: ROUTE_P_S, seats: SEATS_L_K},
  {id: 20, departureDate: new Date('2020-01-23'), route: ROUTE_K_D, seats: SEATS_K_D},
  {id: 21, departureDate: new Date('2020-01-23'), route: ROUTE_P_S, seats: SEATS_L_K},
];
