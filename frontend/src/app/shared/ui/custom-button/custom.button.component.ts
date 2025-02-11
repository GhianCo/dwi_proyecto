import { JsonPipe } from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  standalone: true,
  selector: 'custom-button',
  templateUrl: './custom.button.component.html',
  imports: [
    MatButton,
    MatProgressSpinner,
    JsonPipe
  ]
})

export class CustomButtonComponent implements OnInit {
  @Input() color: String = 'primary';
  @Input() disabled: boolean = false;
  @Input() text: String = 'Click me!!!';
  @Output() eventClick: EventEmitter<any> = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }

  public click() {
    this.eventClick.emit();
  }

}
