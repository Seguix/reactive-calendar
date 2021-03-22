import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Appointment } from '../../types/appointment.type';

@Component({
  selector: 'day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnInit {
  @Input() date: Date;
  @Input() appointments: Array<Appointment>;

  @Output() public addAppointment = new EventEmitter<Date>();
  @Output() public updateAppointment = new EventEmitter<Appointment>();
  @Output() public removeAppointment = new EventEmitter<Appointment>();

  constructor() { }

  ngOnInit(): void {
  }

}
