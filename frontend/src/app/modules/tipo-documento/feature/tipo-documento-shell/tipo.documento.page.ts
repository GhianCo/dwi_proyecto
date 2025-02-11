import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
    standalone: true,
    templateUrl: './tipo.documento.page.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        RouterOutlet
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TipoDocumentoPage {
    constructor() {
    }
}
