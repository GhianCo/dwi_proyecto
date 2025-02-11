import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './caja.page.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CajaPage implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
