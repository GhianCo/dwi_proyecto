import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ExampleStore} from "./data-access/example.store";

@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ExampleComponent {
    exampleStore = inject(ExampleStore);

    /**
     * Constructor
     */
    constructor() {
    }
}
