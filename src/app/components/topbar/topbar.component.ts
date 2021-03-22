import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { VIEW_MODE } from '../../constans';

@Component({
  selector: 'topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() setViewMode = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();

  VIEW_MODE = VIEW_MODE;

  constructor() { }

  ngOnInit(): void {
  }

}
