import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { PreoveedorRemoteReq } from "./proveedor.remote.req";
import { TipoDocumentoRemoteReq } from "app/modules/tipo-documento/data-access/tipo.documento.remote.req";
import { PaisRemoteReq } from "app/modules/pais/data-access/pais.remote.req";
import { DepartamentoRemoteReq } from "app/modules/departamento/data-access/departamento.remote.req";
import { ProvinciaRemoteReq } from "app/modules/provincia/data-access/provincia.remote.req";
import { DistritoRemoteReq } from "app/modules/distrito/data-access/distrito.remote.req";

export type IProveedorState = {
    proveedorLoading: boolean,
    proveedorData: any[],
    proveedorPagination: any,
    transportistaError: any,

    tiposdocumentosData: any[],

    departamentosData: any[],
    provinciasData: any[],
    distritosData: any[],
    paisesData: any[],

    proveedorSelected: any,

    filterProveedorToApply: any,

    createUpdateStateProveedorLoading: boolean,
    createUpdateStateProveedorFlashMessage: string,
    createUpdateStateProveedorError: any,
}

const initialProveedorState: IProveedorState = {
    proveedorLoading: false,
    proveedorData: [],
    proveedorPagination: null,
    transportistaError: null,

    proveedorSelected: null,

    filterProveedorToApply: {
        query: PARAM.UNDEFINED,
        page: 1,
        perPage: 10
    },

    tiposdocumentosData: [],
    departamentosData: [],
    provinciasData: [],
    distritosData: [],
    paisesData: [],

    createUpdateStateProveedorLoading: false,
    createUpdateStateProveedorFlashMessage: null,
    createUpdateStateProveedorError: null,
};

@Injectable({ providedIn: 'root' })
export class ProveedorStore extends SignalStore<IProveedorState> {

    public readonly vm = this.selectMany([
        'proveedorLoading',
        'proveedorData',
        'proveedorPagination',
        'transportistaError',
        'proveedorSelected',
        'filterProveedorToApply',
        'tiposdocumentosData',
        'departamentosData',
        'provinciasData',
        'distritosData',
        'paisesData',
        'createUpdateStateProveedorLoading',
        'createUpdateStateProveedorFlashMessage',
        'createUpdateStateProveedorError',
    ]);

    constructor(
        private _proveedorRemoteReq: PreoveedorRemoteReq,
        private _paisRemoteReq: PaisRemoteReq,
        private _deparamentoRemoteReq: DepartamentoRemoteReq,
        private _provinciaRemoteReq: ProvinciaRemoteReq,
        private _distritoRemoteReq: DistritoRemoteReq,
        private _tipoDocumentoRemoteReq: TipoDocumentoRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialProveedorState);
    }

    public get proveedorSelected() {
        const state = this.vm();
        return state.proveedorSelected
    };

    public get proveedorData() {
        const state = this.vm();
        return state.proveedorData
    };

    public get filterProveedorToApply() {
        const state = this.vm();
        return state.filterProveedorToApply
    };

    public async loadSearchProveedor(criteria) {
        this.patch({ proveedorLoading: true, transportistaError: null });
        this._proveedorRemoteReq.requestSearchProveedorByCriteria(criteria).pipe(
            tap(async ({ data, pagination }) => {
                this.patch({
                    proveedorData: data,
                    proveedorPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({ proveedorLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    transportistaError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllProveedorStore(): Observable<any> {
        this.loadSearchProveedor(this.filterProveedorToApply);
        return of(true);
    };

    public addProveedor(): Observable<any> {
        const proveedorData: any[] = [...this.proveedorData];

        const proveedorSelected = {
            proveedor_id: null,
            tipodocumento_id: null,
            proveedor_numero: null,
            proveedor_nombre: null,
            proveedor_comercial: null,
            proveedor_diascredito: null,
            proveedor_activo: true,
        };

        proveedorData.unshift(proveedorSelected);

        this.patch({
            proveedorData: proveedorData,
            proveedorSelected: proveedorSelected
        })
        return of(true);
    };

    public searchProveedorById(proveedorId): Observable<any> {
        return of(this.vm().proveedorData).pipe(
            take(1),
            map((proveedor) => {
                const proveedorSelected = proveedor.find(item => item.proveedor_id == proveedorId) || null;

                this.patch({
                    proveedorSelected
                });

                return proveedorSelected;
            }),
            switchMap((proveedor) => {
                if (!proveedor) {
                    return throwError(() => 'No se encontro el proveedor con el id: ' + proveedorId + '!');
                }
                return of(proveedor);
            })
        );
    };

    public changeQueryInTransportista(searchValue) {
        const filterProveedorToApply = this.vm().filterProveedorToApply;
        filterProveedorToApply.query = searchValue;
        if (!searchValue.length) {
            filterProveedorToApply.query = PARAM.UNDEFINED;
        }
        filterProveedorToApply.page = 1;
        this.loadSearchProveedor(filterProveedorToApply);
        this.patch({ filterProveedorToApply: filterProveedorToApply });
    };

    public async loadCreateProveedor(formData) {
        this.patch({
            createUpdateStateProveedorLoading: true,
            createUpdateStateProveedorError: null
        });
        // formData.zona_estado = formData.zona_activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._proveedorRemoteReq.requestCreateProveedor(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateTransportistaInList(data);
                this.patch({
                    proveedorSelected: data,
                    createUpdateStateProveedorFlashMessage: message,
                    createUpdateStateProveedorError: null
                });

                this._router.navigate(['gestion/proveedor', data.proveedor_id], { relativeTo: this._activatedRoute });

                setTimeout(_ => {
                    this.patch({
                        // createUpdateStateTipoDocumentoFlashMessage: null
                        createUpdateStateProveedorFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({
                    // createUpdateStateTipoDocumentoLoading: false 
                    createUpdateStateProveedorLoading: false
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    // createUpdateStateTipoDocumentoError: error
                    createUpdateStateProveedorError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListProveedorToCreate() {
        const transportistaDataStored = this.vm().proveedorData;
        const transportistaData = transportistaDataStored.filter((transportistaData) => transportistaData.proveedor_id > 0);
        this.patch({
            proveedorData: transportistaData,
            proveedorSelected: null
        });
    }

    public updateTransportistaInList(transportistaToUpdate: any) {
        const transportistaData = this.vm().proveedorData;
        const transportistaIndex = transportistaData.findIndex(transportista => !transportista.proveedor_id || transportista.proveedor_id == transportistaToUpdate.proveedor_id);

        if (transportistaIndex >= 0) {
            transportistaData[transportistaIndex] = transportistaToUpdate;
        }
        this.patch({
            proveedorData: transportistaData,
        });
    }

    public async loadUpdateProveedor(formData: any) {
        this.patch({ createUpdateStateProveedorLoading: true, createUpdateStateProveedorError: null });

        // formData.zona_estado = formData.zona_activo ? PARAM.ACTIVO : PARAM.INACTIVO;

        this._proveedorRemoteReq.requestUpdateProveedor(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateTransportistaInList(data);
                this.patch({
                    proveedorSelected: data,
                    createUpdateStateProveedorFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        // createUpdateStateTipoDocumentoFlashMessage: null,
                        createUpdateStateProveedorFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({ createUpdateStateProveedorLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    // createUpdateStateTipoDocumentoError: error,
                    createUpdateStateProveedorError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInTransportista(pagination: any) {
        const filterTransportistaToApply = this.vm().filterProveedorToApply;
        filterTransportistaToApply.page = pagination.pageIndex + 1;
        filterTransportistaToApply.perPage = pagination.pageSize;
        this.loadSearchProveedor(filterTransportistaToApply);
        this.patch({ filterProveedorToApply: filterTransportistaToApply });
    };

    public async cargarTiposDocumentoActivos() {
        const critearia = {
            active: PARAM.ACTIVO
        }

        this._tipoDocumentoRemoteReq.requestSearchTipoDocumentoByCriteria(critearia).pipe(
            tap(async ({ data }) => {
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

    public async cargarDepartamentosActivos(paisId) {
        const critearia = {
            active: PARAM.ACTIVO,
            paisId,
        }

        this._deparamentoRemoteReq.requestSearchDepartamentoByCriteria(critearia).pipe(
            tap(async ({ data }) => {
                this.patch({
                    departamentosData: data
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    departamentosData: []
                }));
            }),
        ).subscribe();
    }

    public async cargarProvinciasActivos(departamentoId) {
        const critearia = {
            active: PARAM.ACTIVO,
            departamento_id: departamentoId
        }

        this._provinciaRemoteReq.requestSearchProvinciaByCriteria(critearia).pipe(
            tap(async ({ data }) => {
                this.patch({
                    provinciasData: data
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    provinciasData: []
                }));
            }),
        ).subscribe();
    }

    public async cargarDistritosActivos(provinciaId) {
        const critearia = {
            active: PARAM.ACTIVO,
            provincia_id: provinciaId
        }

        this._distritoRemoteReq.requestSearchDistritoByCriteria(critearia).pipe(
            tap(async ({ data }) => {
                this.patch({
                    distritosData: data
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    distritosData: []
                }));
            }),
        ).subscribe();
    }

    public async cargarPaisesActivos() {
        const critearia = {
            active: PARAM.ACTIVO
        }

        this._paisRemoteReq.requestSearchPaisByCriteria(critearia).pipe(
            tap(async ({ data }) => {
                this.patch({
                    paisesData: data
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    paisesData: []
                }));
            }),
        ).subscribe();
    }

}
