import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, Observable, of, throwError} from "rxjs";
import {catchError, map, switchMap, take, tap} from "rxjs/operators";
import {PARAM} from "@shared/constants/app.const";
import {SignalStore} from "@shared/data-access/signal.store";
import {ConductorRemoteReq} from "./conductor.remote.req";

export type IConductorState = {
    conductorLoading: boolean,
    conductorData: any[],
    conductorPagination: any,
    conductorError: any,

    conductorSelected: any,

    filterConductorToApply: any,

    createUpdateStateConductorLoading: boolean,
    createUpdateStateConductorFlashMessage: string,
    createUpdateStateConductorError: any,
}

const initialConductorState: IConductorState = {
    conductorLoading: false,
    conductorData: [],
    conductorPagination: null,
    conductorError: null,

    conductorSelected: null,

    filterConductorToApply: {
        query: PARAM.VACIO,
        page: 1,
        perPage: 10
    },

    createUpdateStateConductorLoading: false,
    createUpdateStateConductorFlashMessage: null,
    createUpdateStateConductorError: null,
};

@Injectable({providedIn: 'root'})
export class ConductorStore extends SignalStore<IConductorState> {

    public readonly vm = this.selectMany([
        'filterConductorToApply',

        'conductorLoading',
        'conductorData',
        'conductorPagination',
        'conductorError',

        'conductorSelected',

        'createUpdateStateConductorLoading',
        'createUpdateStateConductorFlashMessage',
        'createUpdateStateConductorError',
    ]);

    constructor(
        private _conductorRemoteReq: ConductorRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialConductorState);
    }

    public get conductorSelected() {
        const state = this.vm();
        return state.conductorSelected
    };

    public get conductorData() {
        const state = this.vm();
        return state.conductorData
    };

    public get filterConductorToApply() {
        const state = this.vm();
        return state.filterConductorToApply
    };

    public async loadSearchConductor(criteria) {
        this.patch({conductorLoading: true, conductorError: null});
        this._conductorRemoteReq.requestSearchConductorByCriteria(criteria).pipe(
            tap(async ({data, pagination}) => {
                this.patch({
                    conductorData: data,
                    conductorPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({conductorLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    conductorError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllConductor(): Observable<any> {
        this.loadSearchConductor(this.filterConductorToApply);
        return of(true);
    };

    public addConductor(): Observable<any> {
        const conductorData: any[] = [...this.conductorData];

        const conductorSelected = {
            id: null,
            nombres: null,
            apellidos: null,
            numero_documento: null,
            telefono: null,
            fecha_nacimiento: null,
            activo: true
        };

        conductorData.unshift(conductorSelected);

        this.patch({
            conductorData,
            conductorSelected
        })
        return of(true);
    };

    public searchConductorById(conductorId): Observable<any> {
        return of(this.vm().conductorData).pipe(
            take(1),
            map((conductor) => {

                const conductorSelected = conductor.find(item => item.id == conductorId) || null;

                this.patch({
                    conductorSelected
                });

                return conductorSelected;
            }),
            switchMap((conductor) => {

                if (!conductor) {
                    return throwError('No se encontró el conductor con el id: ' + conductorId + '!');
                }

                return of(conductor);
            })
        );
    };

    public changeQueryInConductor(searchValue) {
        const filterConductorToApply = this.vm().filterConductorToApply;
        filterConductorToApply.query = searchValue;
        if (!searchValue.length) {
            filterConductorToApply.query = PARAM.VACIO;
        }
        filterConductorToApply.page = 1;
        this.loadSearchConductor(filterConductorToApply);
        this.patch({filterConductorToApply});
    };

    public async loadCreateConductor(formData) {
        this.patch({createUpdateStateConductorLoading: true, createUpdateStateConductorError: null});
        delete formData.id;
        formData.activo = formData.activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._conductorRemoteReq.requestCreateConductor(formData).pipe(
            tap(async ({data, message}) => {
                this.updateConductorInList(data);
                this.patch({
                    conductorSelected: data,
                    createUpdateStateConductorFlashMessage: message,
                    createUpdateStateConductorError: null
                });

                this._router.navigate(['gestion/conductor', data.id], {relativeTo: this._activatedRoute});

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateConductorFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStateConductorLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateConductorError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListConductorToCreate() {
        const conductorDataStored = this.vm().conductorData;
        const conductorData = conductorDataStored.filter(conductor => conductor.id > 0);
        this.patch({
            conductorData,
            conductorSelected: null
        });
    }

    public updateConductorInList(conductorToUpdate) {
        const conductorData = this.vm().conductorData;
        const conductorIndex = conductorData.findIndex(conductor => !conductor.id || conductor.id == conductorToUpdate.id);

        if (conductorIndex >= 0) {
            conductorData[conductorIndex] = conductorToUpdate;
        }
        this.patch({
            conductorData,
        });
    }

    public async loadUpdateConductor(formData) {
        this.patch({createUpdateStateConductorLoading: true, createUpdateStateConductorError: null});
        formData.activa = formData.activa ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._conductorRemoteReq.requestUpdateConductor(formData).pipe(
            tap(async ({data, message}) => {
                this.updateConductorInList(data);
                this.patch({
                    conductorSelected: data,
                    createUpdateStateConductorFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        createUpdateStateConductorFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStateConductorLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateConductorError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInConductor(pagination: any) {
        const filterConductorToApply = this.vm().filterConductorToApply;
        filterConductorToApply.page = pagination.pageIndex + 1;
        filterConductorToApply.perPage = pagination.pageSize;
        this.loadSearchConductor(filterConductorToApply);
        this.patch({filterConductorToApply});
    };
}
