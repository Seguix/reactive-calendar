import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Appointment } from '../../types/appointment.type';
import * as moment from 'moment';

@Component({
  selector: 'day-detail',
  templateUrl: './day-detail.component.html',
  styleUrls: ['./day-detail.component.scss']
})
export class DayDetailComponent implements OnInit {
  @Input() date: Date;
  @Input() appointments: any;

  @Output() public addAppointment = new EventEmitter<Date>();
  @Output() public updateAppointment = new EventEmitter<Appointment>();
  @Output() public removeAppointment = new EventEmitter<String>();

  editMode = false;

  constructor() { }
  
  ngOnInit(): void { }
  
  add(): void {
    this.addAppointment.emit(moment(this.date).toDate());
  }
  
  update(appointment: Appointment, $key: string) {
    this.updateAppointment.emit(Object.assign({$key}, appointment));
  }
}
