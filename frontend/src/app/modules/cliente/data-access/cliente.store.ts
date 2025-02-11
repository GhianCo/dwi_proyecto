import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { ClienteRemoteReq } from "./cliente.remote.req";
import { TipoDocumentoRemoteReq } from "app/modules/tipo-documento/data-access/tipo.documento.remote.req";
import { PaisRemoteReq } from "app/modules/pais/data-access/pais.remote.req";
import { DepartamentoRemoteReq } from "app/modules/departamento/data-access/departamento.remote.req";
import { ProvinciaRemoteReq } from "app/modules/provincia/data-access/provincia.remote.req";
import { DistritoRemoteReq } from "app/modules/distrito/data-access/distrito.remote.req";
import { VendedorRemoteReq } from "app/modules/vendedor/data-access/vendedor.remote.req";
import { ZonaRemoteReq } from "app/modules/zona/data-access/zona.remote.req";

export type IProveedorState = {
    clienteLoading: boolean,
    clienteData: any[],
    clientePagination: any,
    clienteError: any,

    tiposdocumentosData: any[],
    vendedoresData: any[],
    zonasData: any[],

    clienteSelected: any,

    filterClienteToApply: any,

    createUpdateStateClienteLoading: boolean,
    createUpdateStateClienteFlashMessage: string,
    createUpdateStateClienteError: any,
}

const initialProveedorState: IProveedorState = {
    clienteLoading: false,
    clienteData: [],
    clientePagination: null,
    clienteError: null,

    clienteSelected: null,

    filterClienteToApply: {
        query: PARAM.UNDEFINED,
        page: 1,
        perPage: 10
    },

    tiposdocumentosData: [],
    vendedoresData: [],
    zonasData: [],

    createUpdateStateClienteLoading: false,
    createUpdateStateClienteFlashMessage: null,
    createUpdateStateClienteError: null,
};

@Injectable({ providedIn: 'root' })
export class ClienteStore extends SignalStore<IProveedorState> {

    public readonly vm = this.selectMany([
        'clienteLoading',
        'clienteData',
        'clientePagination',
        'clienteError',
        'clienteSelected',
        'filterClienteToApply',
        'tiposdocumentosData',
        "zonasData",
        "vendedoresData",
        'createUpdateStateClienteLoading',
        'createUpdateStateClienteFlashMessage',
        'createUpdateStateClienteError',
    ]);

    constructor(
        private _clienteRemoteReq: ClienteRemoteReq,
        private _paisRemoteReq: PaisRemoteReq,
        private _deparamentoRemoteReq: DepartamentoRemoteReq,
        private _provinciaRemoteReq: ProvinciaRemoteReq,
        private _distritoRemoteReq: DistritoRemoteReq,
        private _tipoDocumentoRemoteReq: TipoDocumentoRemoteReq,
        private _vendedorRemoteReq: VendedorRemoteReq,
        private _zonaRemoteReq: ZonaRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialProveedorState);
    }

    public get clientetSelected() {
        const state = this.vm();
        return state.clienteSelected
    };

    public get clienteData() {
        const state = this.vm();
        return state.clienteData
    };

    public get filterClienteToApply() {
        const state = this.vm();
        return state.filterClienteToApply
    };

    public updateFilterClienteToApply(filterClienteToApply: any) {
        this.patch({
            filterClienteToApply: {
                ...this.vm().filterClienteToApply,
                ...filterClienteToApply
            }
        })
    }

    public async loadSearchCliente(criteria) {
        this.patch({ clienteLoading: true, clienteError: null });
        this._clienteRemoteReq.requestSearchClienteByCriteria(criteria).pipe(
            tap(async ({ data, pagination }) => {
                this.patch({
                    clienteData: data,
                    clientePagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({ clienteLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    clienteError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllClienteStore(): Observable<any> {
        this.loadSearchCliente(this.filterClienteToApply);
        return of(true);
    };

    public addCliente(): Observable<any> {
        const proveedorData: any[] = [...this.clienteData];

        const proveedorSelected = {
            cliente_id: null,
            zona_id: null,
            tipodocumento_id: null,
            cliente_documento: null,
            cliente_nombre: null,
            cliente_apellidos: null,
            cliente_telefono: null,
            cliente_activo: true,
            vendedor_id: null,
        };

        proveedorData.unshift(proveedorSelected);

        this.patch({
            clienteData: proveedorData,
            clienteSelected: proveedorSelected
        })
        return of(true);
    };

    public searchClienteById(clienteId): Observable<any> {
        return of(this.vm().clienteData).pipe(
            take(1),
            map((cliente) => {
                const clienteSelected = cliente.find(item => item.cliente_id == clienteId) || null;

                this.patch({
                    clienteSelected
                });

                return clienteSelected;
            }),
            switchMap((cliente) => {
                if (!cliente) {
                    return throwError(() => 'No se encontro el cliente con el id: ' + clienteId + '!');
                }
                return of(cliente);
            })
        );
    };

    public changeQueryInCliente(searchValue) {
        const filterClienteToApply = this.vm().filterClienteToApply;
        filterClienteToApply.query = searchValue;
        if (!searchValue.length) {
            filterClienteToApply.query = PARAM.UNDEFINED;
        }
        filterClienteToApply.page = 1;
        this.loadSearchCliente(filterClienteToApply);
        this.patch({ filterClienteToApply });
    };

    public async loadCreateCliente(formData) {
        this.patch({
            createUpdateStateClienteLoading: true,
            createUpdateStateClienteError: null
        });
        // formData.zona_estado = formData.zona_activo ? PARAM.ACTIVO : PARAM.INACTIVO;
        this._clienteRemoteReq.requestCreateCliente(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateClienteInList(data);
                this.patch({
                    clienteSelected: data,
                    createUpdateStateClienteFlashMessage: message,
                    createUpdateStateClienteError: null
                });

                this._router.navigate(['gestion/cliente', data.cliente_id], { relativeTo: this._activatedRoute });

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateClienteFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({
                    createUpdateStateClienteLoading: false
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateClienteError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListClienteToCreate() {
        const clienteDataStored = this.vm().clienteData;
        const clienteData = clienteDataStored.filter((transportistaData) => transportistaData.cliente_id > 0);
        this.patch({
            clienteData,
            clienteSelected: null
        });
    }

    public updateClienteInList(clienteToUpdate: any) {
        const clienteData = this.vm().clienteData;
        const clienteIndex = clienteData.findIndex(cliente => !cliente.cliente_id || cliente.cliente_id == clienteToUpdate.cliente_id);

        if (clienteIndex >= 0) {
            clienteData[clienteIndex] = clienteToUpdate;
        }
        this.patch({
            clienteData,
        });
    }

    public async loadUpdateCliente(formData: any) {
        this.patch({ createUpdateStateClienteLoading: true, createUpdateStateClienteError: null });

        this._clienteRemoteReq.requestUpdateCliente(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateClienteInList(data);
                this.patch({
                    clienteSelected: data,
                    createUpdateStateClienteFlashMessage: message,
                });
                setTimeout(_ => {
                    this.patch({
                        createUpdateStateClienteFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({ createUpdateStateClienteLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateClienteError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInCliente(pagination: any) {
        const filterClienteToApply = this.vm().filterClienteToApply;
        filterClienteToApply.page = pagination.pageIndex + 1;
        filterClienteToApply.perPage = pagination.pageSize;
        this.loadSearchCliente(filterClienteToApply);
        this.patch({ filterClienteToApply });
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
                return of(this.patch({
                    tiposdocumentosData: []
                }));
            }),
        ).subscribe();
    }

    public async cargarVendedoresActivos() {
        const critearia = {
            active: PARAM.ACTIVO
        }

        this._vendedorRemoteReq.requestSearchVendedorByCriteria(critearia).pipe(
            tap(async ({ data }) => {
                this.patch({
                    vendedoresData: data
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    vendedoresData: []
                }));
            }),
        ).subscribe();
    }

    public async cargarZonasActivas() {
        const critearia = {
            active: PARAM.ACTIVO
        }

        this._zonaRemoteReq.requestSearchZonaByCriteria(critearia).pipe(
            tap(async ({ data }) => {
                this.patch({
                    zonasData: data
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    zonasData: []
                }));
            }),
        ).subscribe();
    }
}
