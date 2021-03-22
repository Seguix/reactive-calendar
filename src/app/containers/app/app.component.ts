import { Component, OnInit } from '@angular/core';
import { VIEW_MODE } from '../../constans';
import * as moment from 'moment';
import { Appointment } from '../../types/appointment.type';
import { AngularFireDatabase } from '@angular/fire/database';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { map, mergeMap, shareReplay} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  VIEW_MODE = VIEW_MODE;
  viewMode$ = new BehaviorSubject(VIEW_MODE.MONTH);
  navigation$ = new BehaviorSubject<number>(0);
  searchTerm$ = new BehaviorSubject('');

  private currentDateM$ = this.viewMode$.pipe(
    mergeMap((viewMode: string) => {
      let dateM = moment();
      return this.navigation$.pipe(
        map((action: number) => {
          switch (viewMode) {
              case VIEW_MODE.MONTH:
                  return dateM.startOf('month').add(action, 'months');
              case VIEW_MODE.WEEK:
                  return dateM.startOf('week').add(action, 'weeks');
              case VIEW_MODE.DAY:
                  return dateM.startOf('day').add(action, 'days');
          }
          return dateM;
        })
      )
    }),
    shareReplay()
  );

  currentDate$ = this.currentDateM$.pipe(map(dateM => dateM.toDate()));
  currentYear$ = this.currentDateM$.pipe(map(dateM => dateM.year()));
  currentMonth$ = this.currentDateM$.pipe(map(dateM => dateM.month()));
  currentWeek$ = this.currentDateM$.pipe(map(dateM => dateM.week()));

  payloadToObject = _ => {
    const object = _.payload.val();
    object.$key = _.payload.key;
    return object;
  }

  appointmentsAsync$ = this.db.list('/appointments').snapshotChanges().pipe(map(data => data.map(this.payloadToObject)));
  appointments$ = this.db.list('/appointments');

  filteredAppointments$ = combineLatest([this.viewMode$, this.currentDateM$, this.appointmentsAsync$, this.searchTerm$]).pipe(
    map((val) => {
      switch (val[0]) {
        case 'MONTH':
          return val[2]
            .filter((item: Appointment) => moment(item.date).format('MM/YYYY') === val[1].format('MM/YYYY'))
            .filter((item) => this.filterByTerm(item, val[3]));
        case 'WEEK':
          return val[2]
            .filter((item: Appointment) => moment(item.date).format('ww/YYYY') === val[1].format('ww/YYYY'))
            .filter((item) => this.filterByTerm(item, val[3]));
        case 'DAY':
          return val[2]
            .filter((item: Appointment) => moment(item.date).format('DD/MM/YYYY') === val[1].format('DD/MM/YYYY'))
            .filter((item) => this.filterByTerm(item, val[3]));
      }
    }),
    shareReplay()
  );

  constructor(private db: AngularFireDatabase) { }

  ngOnInit(): void { }

  private filterByTerm(appointment, term: string): boolean {
    return appointment.description.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  onSetViewMode(viewMode: string): void {
    this.viewMode$.next(viewMode);
  }

  onPrevious(): void {
    this.navigation$.next(-1);
  }

  onNext(): void {
    this.navigation$.next(1);
  }

  onSearchChanged(e: string): void {
    this.searchTerm$.next(e);
  }

  onRemoveAppointment(id: string): void {
    this.appointments$.remove(id);
  }

  onAddAppointment(date: Date): void {
    this.appointments$.push(new Appointment(date.toISOString(), ''));
  }

  onUpdateAppointment(appointment: Appointment): void {
    this.db.object('appointments/' + appointment.$key).set({
      description: appointment.description,
      date: appointment.date
    });
  }

}

