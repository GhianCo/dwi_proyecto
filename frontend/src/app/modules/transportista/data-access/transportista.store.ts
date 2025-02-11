import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { TransportistaRemoteReq } from "./transportista.remote.req";
import { TipoDocumentoRemoteReq } from "app/modules/tipo-documento/data-access/tipo.documento.remote.req";

export type ITransportistaState = {
    transportistaLoading: boolean,
    transportistaData: any[],
    transportistaPagination: any,
    transportistaError: any,

    tiposdocumentosData: any[],

    transportistaSelected: any,

    filterTransportistaToApply: any,

    createUpdateStateTransportistaLoading: boolean,
    createUpdateStateTransportistaFlashMessage: string,
    createUpdateStateTransportistaError: any,
}

const initialTipoDocumentoState: ITransportistaState = {
    transportistaLoading: false,
    transportistaData: [],
    transportistaPagination: null,
    transportistaError: null,

    transportistaSelected: null,

    filterTransportistaToApply: {
        query: PARAM.UNDEFINED,
        page: 1,
        perPage: 10
    },

    tiposdocumentosData: [],

    createUpdateStateTransportistaLoading: false,
    createUpdateStateTransportistaFlashMessage: null,
    createUpdateStateTransportistaError: null,
};

@Injectable({ providedIn: 'root' })
export class TransportistaStore extends SignalStore<ITransportistaState> {

    public readonly vm = this.selectMany([
        "transportistaLoading",
        "transportistaData",
        "transportistaPagination",
        "transportistaError",

        "transportistaSelected",

        "filterTransportistaToApply",

        "createUpdateStateTransportistaLoading",
        "createUpdateStateTransportistaFlashMessage",
        "createUpdateStateTransportistaError",
        "tiposdocumentosData"
    ]);

    constructor(
        private _transportistaRemoteReq: TransportistaRemoteReq,
        private _tipoDocumentoRemoteReq: TipoDocumentoRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialTipoDocumentoState);
    }

    public get transportistaSelected() {
        const state = this.vm();
        return state.transportistaSelected
    };

    public get transportistaData() {
        const state = this.vm();
        return state.transportistaData
    };

    public get filterZonaToApply() {
        const state = this.vm();
        return state.filterTransportistaToApply
    };

    public async loadSearchTransportista(criteria) {
        this.patch({ transportistaLoading: true, transportistaError: null });
        this._transportistaRemoteReq.requestSearchTransportistaByCriteria(criteria).pipe(
            tap(async ({ data, pagination }) => {
                this.patch({
                    transportistaData: data,
                    transportistaPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({ transportistaLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    transportistaError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllTransportistaStore(): Observable<any> {
        this.loadSearchTransportista(this.filterZonaToApply);
        return of(true);
    };

    public addTransportista(): Observable<any> {
        const transportistaData: any[] = [...this.transportistaData];

        const transportistaSelected = {
            transportista_id: null,
            transportista_nombre: null,
            transportista_direccionfiscal: null,
            transportista_activo: true,
            tipodocumento_id: null,
            tipodocumento: {
                tipodocumento_descripcion: ""
            }
        };

        transportistaData.unshift(transportistaSelected);

        this.patch({
            transportistaData,
            transportistaSelected
        })
        return of(true);
    };

    public searchTransportistaById(transportistaId): Observable<any> {
        return of(this.vm().transportistaData).pipe(
            take(1),
            map((tipoDocumento) => {
                const transportistaSelected = tipoDocumento.find(item => item.transportista_id == transportistaId) || null;

                this.patch({
                    transportistaSelected
                });

                return transportistaSelected;
            }),
            switchMap((transportista) => {
                if (!transportista) {
                    return throwError(() => 'No se encontro el transportista con el id: ' + transportistaId + '!');
                }
                return of(transportista);
            })
        );
    };

    public changeQueryInTransportista(searchValue) {
        const filterTransportistaToApply = this.vm().filterTransportistaToApply;
        filterTransportistaToApply.query = searchValue;
        if (!searchValue.length) {
            filterTransportistaToApply.query = PARAM.UNDEFINED;
        }
        filterTransportistaToApply.page = 1;
        this.loadSearchTransportista(filterTransportistaToApply);
        this.patch({ filterTransportistaToApply });
    };

    public async loadCreateTransportista(formData) {
        this.patch({
            createUpdateStateTransportistaLoading: true,
            createUpdateStateTransportistaError: null
        });
        formData.zona_estado = formData.zona_activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._transportistaRemoteReq.requestCreateTransportista(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateTransportistaInList(data);
                this.patch({
                    transportistaSelected: data,
                    createUpdateStateTransportistaFlashMessage: message,
                    createUpdateStateTransportistaError: null
                });

                this._router.navigate(['gestion/transportista', data.transportista_id], { relativeTo: this._activatedRoute });

                setTimeout(_ => {
                    this.patch({
                        // createUpdateStateTipoDocumentoFlashMessage: null
                        createUpdateStateTransportistaFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({
                    // createUpdateStateTipoDocumentoLoading: false 
                    createUpdateStateTransportistaLoading: false
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    // createUpdateStateTipoDocumentoError: error
                    createUpdateStateTransportistaError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListTransportistaToCreate() {
        const transportistaDataStored = this.vm().transportistaData;
        const transportistaData = transportistaDataStored.filter((transportistaData) => transportistaData.transportista_id > 0);
        this.patch({
            transportistaData,
            transportistaSelected: null
        });
    }

    public updateTransportistaInList(transportistaToUpdate: any) {
        const transportistaData = this.vm().transportistaData;
        const transportistaIndex = transportistaData.findIndex(transportista => !transportista.transportista_id || transportista.transportista_id == transportistaToUpdate.transportista_id);

        if (transportistaIndex >= 0) {
            transportistaData[transportistaIndex] = transportistaToUpdate;
        }
        this.patch({
            transportistaData,
        });
    }

    public async loadUpdateTransportista(formData: any) {
        this.patch({ createUpdateStateTransportistaLoading: true, createUpdateStateTransportistaError: null });

        // formData.zona_estado = formData.zona_activo ? PARAM.ACTIVO : PARAM.INACTIVO;

        this._transportistaRemoteReq.requestUpdateTransportista(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateTransportistaInList(data);
                this.patch({
                    transportistaSelected: data,
                    createUpdateStateTransportistaFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        // createUpdateStateTipoDocumentoFlashMessage: null,
                        createUpdateStateTransportistaFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({ createUpdateStateTransportistaLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    // createUpdateStateTipoDocumentoError: error,
                    createUpdateStateTransportistaError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInTransportista(pagination: any) {
        const filterTransportistaToApply = this.vm().filterTransportistaToApply;
        filterTransportistaToApply.page = pagination.pageIndex + 1;
        filterTransportistaToApply.perPage = pagination.pageSize;
        this.loadSearchTransportista(filterTransportistaToApply);
        this.patch({ filterTransportistaToApply });
    };

    public async cargarTiposDocumentoActivos() {
        const critearia = {
            active: PARAM.ACTIVO
        }

        this._tipoDocumentoRemoteReq.requestSearchTipoDocumentoByCriteria(critearia).pipe(
            tap(async ({ data }) => {
                console.log(data)

                this.patch({
                    tiposdocumentosData: data
                });
            }),
            catchError((error) => {
                console.log("erorr", error)
                return of(this.patch({
                    tiposdocumentosData: []
                }));
            }),
        ).subscribe();
    }


}
