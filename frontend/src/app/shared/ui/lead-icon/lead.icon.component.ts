import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-lead-icon',
  templateUrl: './lead.icon.component.html',
  styleUrls: ['./lead.icon.component.scss'],
  imports: [
  ]
})

export class LeadIconComponent implements OnInit {

  @Input() styleIcon: String = 'far';
  @Input() icon = '';
  @Input() size = '1x';
  public faIcon: Array<String> = [];

  constructor() { }

  ngOnInit() {
    this.faIcon = [this.styleIcon, this.icon];
  }

}
