import { Component, EventEmitter, Input, OnChanges, Output, OnInit } from '@angular/core';
import { Appointment } from '../../types/appointment.type';
import * as moment from 'moment';
import { DayWithAppointments } from '../../types/day-with-appointment.type';

@Component({
  selector: 'week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss']
})
export class WeekViewComponent implements OnInit, OnChanges {
  @Input() week: number;
  @Input() year: number;
  @Input() appointments: Array<Appointment>;

  @Output() public addAppointment = new EventEmitter<Appointment>();
  @Output() public updateAppointment = new EventEmitter<Appointment>();
  @Output() public removeAppointment = new EventEmitter<Appointment>();

  days: Array<DayWithAppointments> = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(simpleChanges: any): void {
    if (this.week && this.year) {
        this.days = this.calculateDaysWithAppointments(this.week, this.year, this.appointments || []);
    }
  }

  private calculateDaysWithAppointments(week: number, year: number, appointments: Array<Appointment>): Array<DayWithAppointments> {
    let sundayM = moment().year(year).week(week).startOf('week');
    return Array.from({length: 7}, () => null)
        .map((val, i) => {
            return {
                date: i > 0 ? moment(sundayM.toDate()).add(i, 'days').toDate() : sundayM.toDate(),
                appointments: appointments.filter((appointment: Appointment) => {
                    return moment(sundayM.toDate()).weekday(i).date() === moment(appointment.date).date();
                })
            }
        });
  }

}
