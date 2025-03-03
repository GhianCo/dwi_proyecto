import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, Observable, of, throwError} from "rxjs";
import {catchError, map, switchMap, take, tap} from "rxjs/operators";
import {PARAM} from "@shared/constants/app.const";
import {SignalStore} from "@shared/data-access/signal.store";
import {DestinoRemoteReq} from "./destino.remote.req";

export type IDestinoState = {
    destinoLoading: boolean,
    destinoData: any[],
    destinoPagination: any,
    destinoError: any,

    destinoSelected: any,

    filterDestinoToApply: any,

    createUpdateStateDestinoLoading: boolean,
    createUpdateStateDestinoFlashMessage: string,
    createUpdateStateDestinoError: any,
}

const initialDestinoState: IDestinoState = {
    destinoLoading: false,
    destinoData: [],
    destinoPagination: null,
    destinoError: null,

    destinoSelected: null,

    filterDestinoToApply: {
        query: PARAM.VACIO,
        page: 1,
        perPage: 10
    },

    createUpdateStateDestinoLoading: false,
    createUpdateStateDestinoFlashMessage: null,
    createUpdateStateDestinoError: null,
};

@Injectable({providedIn: 'root'})
export class DestinoStore extends SignalStore<IDestinoState> {

    public readonly vm = this.selectMany([
        'filterDestinoToApply',

        'destinoLoading',
        'destinoData',
        'destinoPagination',
        'destinoError',

        'destinoSelected',

        'createUpdateStateDestinoLoading',
        'createUpdateStateDestinoFlashMessage',
        'createUpdateStateDestinoError',
    ]);

    constructor(
        private _destinoRemoteReq: DestinoRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialDestinoState);
    }

    public get destinoSelected() {
        const state = this.vm();
        return state.destinoSelected
    };

    public get destinoData() {
        const state = this.vm();
        return state.destinoData
    };

    public get filterDestinoToApply() {
        const state = this.vm();
        return state.filterDestinoToApply
    };

    public async loadSearchDestino(criteria) {
        this.patch({destinoLoading: true, destinoError: null});
        this._destinoRemoteReq.requestSearchDestinoByCriteria(criteria).pipe(
            tap(async ({data, pagination}) => {
                this.patch({
                    destinoData: data,
                    destinoPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({destinoLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    destinoError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllDestino(): Observable<any> {
        this.loadSearchDestino(this.filterDestinoToApply);
        return of(true);
    };

    public addDestino(): Observable<any> {
        const destinoData: any[] = [...this.destinoData];

        const destinoSelected = {
            id: null,
            nombre: null,
            tipo: null,
            actividad: null,
            direccion: null,
            activa: true
        };

        destinoData.unshift(destinoSelected);

        this.patch({
            destinoData,
            destinoSelected
        })
        return of(true);
    };

    public searchDestinoById(destinoId): Observable<any> {
        return of(this.vm().destinoData).pipe(
            take(1),
            map((destino) => {

                const destinoSelected = destino.find(item => item.id == destinoId) || null;

                this.patch({
                    destinoSelected
                });

                return destinoSelected;
            }),
            switchMap((destino) => {

                if (!destino) {
                    return throwError('No se encontro el destino con el id: ' + destinoId + '!');
                }

                return of(destino);
            })
        );
    };

    public changeQueryInDestino(searchValue) {
        const filterDestinoToApply = this.vm().filterDestinoToApply;
        filterDestinoToApply.query = searchValue;
        if (!searchValue.length) {
            filterDestinoToApply.query = PARAM.VACIO;
        }
        filterDestinoToApply.page = 1;
        this.loadSearchDestino(filterDestinoToApply);
        this.patch({filterDestinoToApply});
    };

    public async loadCreateDestino(formData) {
        this.patch({createUpdateStateDestinoLoading: true, createUpdateStateDestinoError: null});
        delete formData.id;
        formData.activa = formData.activa ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._destinoRemoteReq.requestCreateDestino(formData).pipe(
            tap(async ({data, message}) => {
                this.updateDestinoInList(data);
                this.patch({
                    destinoSelected: data,
                    createUpdateStateDestinoFlashMessage: message,
                    createUpdateStateDestinoError: null
                });

                this._router.navigate(['gestion/destino', data.id], {relativeTo: this._activatedRoute});

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateDestinoFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStateDestinoLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateDestinoError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListDestinoToCreate() {
        const destinoDataStored = this.vm().destinoData;
        const destinoData = destinoDataStored.filter(destino => destino.id > 0);
        this.patch({
            destinoData,
            destinoSelected: null
        });
    }

    public updateDestinoInList(destinoToUpdate) {
        const destinoData = this.vm().destinoData;
        const destinoIndex = destinoData.findIndex(destino => !destino.id || destino.id == destinoToUpdate.id);

        if (destinoIndex >= 0) {
            destinoData[destinoIndex] = destinoToUpdate;
        }
        this.patch({
            destinoData,
        });
    }

    public async loadUpdateDestino(formData) {
        this.patch({createUpdateStateDestinoLoading: true, createUpdateStateDestinoError: null});
        formData.activa = formData.activa ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._destinoRemoteReq.requestUpdateDestino(formData).pipe(
            tap(async ({data, message}) => {
                this.updateDestinoInList(data);
                this.patch({
                    destinoSelected: data,
                    createUpdateStateDestinoFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        createUpdateStateDestinoFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({createUpdateStateDestinoLoading: false});
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateDestinoError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInDestino(pagination: any) {
        const filterDestinoToApply = this.vm().filterDestinoToApply;
        filterDestinoToApply.page = pagination.pageIndex + 1;
        filterDestinoToApply.perPage = pagination.pageSize;
        this.loadSearchDestino(filterDestinoToApply);
        this.patch({filterDestinoToApply});
    };
}
