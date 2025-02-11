import {
    Component,
    ElementRef, EventEmitter,
    Input, OnDestroy,
    OnInit, Output,
    Renderer2,
    TemplateRef, ViewChild,
    ViewContainerRef
} from '@angular/core';
import {TemplatePortal} from "@angular/cdk/portal";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    selector: 'app-select-searching',
    templateUrl: './select.searching.component.html',
    styleUrls: ['./select.searching.component.scss'],
    imports: [
        CommonModule
    ]
})

export class SelectSearchingComponent implements OnInit, OnDestroy {
    @ViewChild('panelListResults') private _panelListResults: TemplateRef<any>;
    @ViewChild('panelSource') private _panelSource: ElementRef;

    @Input() emptyValueText: string = 'Asignar';
    @Input() valueText: string = '';
    @Input() id: number = null;

    @Input() classSelectSearching: string = 'w-full';
    @Input() classPanelListResults: string = 'w-60';

    @Input() withInputSearch: boolean = true;

    @Input() keyId: number = null;
    @Input() keyValue: string = '';

    @Input() placeholderInputSearch: string = '';
    @Input() openElement: boolean = true;

    @Input() resultsFound: any[] = [];
    @Input() hasError: boolean = false;

    @Output() searchByQueryEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectResultEvent: EventEmitter<any> = new EventEmitter<any>();

    private _panelOverlayRef: OverlayRef;

    public value: string = '';

    constructor(
        private _overlay: Overlay,
        private _renderer2: Renderer2,
        private _viewContainerRef: ViewContainerRef,
    ) {
    }

    ngOnInit() {

    }

    public openPanel() {
        if (this.openElement == false) {
            return false;
        }
        this._panelOverlayRef = this._overlay.create({
            backdropClass: '',
            hasBackdrop: true,
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._panelSource.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    }
                ])
        });

        this._panelOverlayRef.attachments().subscribe(() => {

            this._renderer2.addClass(this._panelSource.nativeElement, 'panel-opened');

            this._panelOverlayRef.overlayElement.querySelector('input')?.focus();
        });

        const templatePortal = new TemplatePortal(this._panelListResults, this._viewContainerRef);

        this._panelOverlayRef.attach(templatePortal);

        this._panelOverlayRef.backdropClick().subscribe(() => {

            this._renderer2.removeClass(this._panelSource.nativeElement, 'panel-opened');

            if (this._panelOverlayRef && this._panelOverlayRef.hasAttached()) {
                this._panelOverlayRef.detach();
            }

            if (templatePortal && templatePortal.isAttached) {
                templatePortal.detach();
            }
        });
    }

    public searchByQuery(query) {
        this.searchByQueryEvent.emit(query);
    }

    public selectResult(result) {
        this.selectResultEvent.emit(result);
        this._panelOverlayRef.detach();
    }

    ngOnDestroy() {

        if (this._panelOverlayRef) {
            this._panelOverlayRef.dispose();
        }
    }

}
