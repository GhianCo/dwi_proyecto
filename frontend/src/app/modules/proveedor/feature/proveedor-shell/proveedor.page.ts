import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
    standalone: true,
    templateUrl: 'proveedor.page.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        RouterOutlet
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportistaPage {
    constructor() {
    }
}
