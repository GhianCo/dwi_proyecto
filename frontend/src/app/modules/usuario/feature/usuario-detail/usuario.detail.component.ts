import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {OverlayRef} from '@angular/cdk/overlay';
import {MatDrawerToggleResult} from '@angular/material/sidenav';
import {of, Subject, takeUntil} from 'rxjs';
import {UsuarioStore} from "../../data-access/usuario.store";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgFor, NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {UsuarioListComponent} from '../usuario-list/usuario.list.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {PersistenceService} from '@shared/services/persistence.service';
import {CARGOS} from '@shared/constants/app.const';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoadingButtonDirective} from '@shared/directives/loading-button.directive';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';

export const MY_FORMATS = {
    parse: {
        dateInput: 'LL'
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY'
    }
};

@Component({
    standalone: true,
    templateUrl: './usuario.detail.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatButton,
        NgIf,
        MatIconButton,
        MatTooltip,
        RouterLink,
        ReactiveFormsModule,
        MatFormField,
        MatSlideToggle,
        MatIcon,
        MatInput,
        MatSelectModule,
        MatOption,
        NgFor,
        MatExpansionModule,
        MatTabsModule,
        MatGridListModule,
        MatLabel,
        MatGridListModule,
        MatCheckboxModule,
        LoadingButtonDirective,
        MatProgressSpinnerModule,
        MatDatepickerModule,
    ],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UsuarioDetailComponent implements OnInit, OnDestroy {

    public hidePassword = true;

    public editMode: boolean = false;
    public form: FormGroup;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    public usuarioStore = inject(UsuarioStore);

    public cargosList = CARGOS;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _usuarioListResolver: UsuarioListComponent,
        private _formBuilder: FormBuilder,
        private router: Router
    ) {
    }

    ngOnInit(): void {

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                console.log('Navegación terminada:', event.url);
            }
        });

        this._usuarioListResolver.matDrawer.open();

        this.form = this._formBuilder.group({
            id: [''],
            persona_id: [''],
            nombres: ['', [Validators.required]],
            apellidos: [],
            email: ["", [Validators.required]],
            telefono: [""],
            nick: ["", [Validators.required]],
            activo: [true],
            clave: ["", [Validators.required]],
            tipo_documento: ["DNI", [Validators.required]],
            numero_documento: ["", [Validators.required]],
            direccion: [null, []],
            rol: [null, []],
        });

        of(this.usuarioStore.vm().usuarioSelected)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((usuarioSelected: any) => {
                this._usuarioListResolver.matDrawer.open();
                if (usuarioSelected?.id > 0) {
                    this._changeDetectorRef.detectChanges();
                    this.toggleEditMode(false);
                } else {
                    this.toggleEditMode(true);
                }
                this.form.patchValue(usuarioSelected);
                this._changeDetectorRef.markForCheck();
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._usuarioListResolver.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null) {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }
        this._changeDetectorRef.markForCheck();
    }

    createUpdateSelected(): void {
        if (this.form.invalid) {
            return;
        }
        let usuario = this.form.getRawValue();
        if (usuario.id) {
            this.usuarioStore.loadUpdateUsuario(usuario);
        } else {
            this.usuarioStore.loadCreateUsuario(usuario);
        }
    }

    togglePassword() {
        this.hidePassword = !this.hidePassword;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(true);
        this._unsubscribeAll.complete();

        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }
}
