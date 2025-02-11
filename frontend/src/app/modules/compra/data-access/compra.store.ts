import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { HTTP_RESPONSE, PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { TipoDocumentoRemoteReq } from "app/modules/tipo-documento/data-access/tipo.documento.remote.req";
import { UsuarioRemoteReq } from "app/modules/usuario/data-access/usuario.remote.req";
import { DateUtilityService } from "@shared/services/date-utility.service";
import { CompraRemoteReq } from "./compra.remote.req";

export type ICompraState = {
    compraLoading: boolean,
    compraData: any[],
    compraPagination: any,
    compraError: any,

    compraSelected: any,
    compraLoadingSelected: boolean,

    filterCompraToApply: any,

    createUpdateStateCompraLoading: boolean,
    createUpdateStateCompraFlashMessage: string,
    createUpdateStateCompraError: any,

    compraCreated: boolean

}

const initialVentaState: ICompraState = {
    compraLoading: false,
    compraData: [],
    compraPagination: null,
    compraError: null,

    compraSelected: null,
    compraLoadingSelected: false,

    filterCompraToApply: {
        cliente: null,
        page: 1,
        perPage: 10,
        pedidoCodigo: null,
        active: null,
        pedidoPendiente: null,
    },    

    createUpdateStateCompraLoading: false,
    createUpdateStateCompraFlashMessage: null,
    createUpdateStateCompraError: null,
    compraCreated: false
};

@Injectable({ providedIn: 'root' })
export class CompraStore extends SignalStore<ICompraState> {

    public readonly vm = this.selectMany([
        'compraLoading',
        'compraData',
        'compraPagination',
        'compraSelected',
        "compraLoadingSelected",
        'filterCompraToApply',
        'createUpdateStateCompraLoading',
        'createUpdateStateCompraFlashMessage',
        'createUpdateStateCompraError',
    ]);

    constructor(
        private _compraRemoteReq: CompraRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        super();
        this.initialize(initialVentaState);
    }

    public clearPedidoSelected() {
        this.patch({ compraSelected: null });
    }

    public updateFilterOrdencompraToApply(filterOrdencompraToApply: any) {
        this.patch({ filterCompraToApply: {
            ...this.vm().filterCompraToApply,
            ...filterOrdencompraToApply
        }});
    }

    public setOrdenCompraCreated(ordenCompraCreated: boolean) {
        this.patch({ compraCreated: ordenCompraCreated });
    }

    public async loadSearchCompras(criteria) {
        this.patch({ compraLoading: true });

        this._compraRemoteReq.requestSearchCompraByCriteria(criteria).pipe(
            tap(async (response) => {
                this.patch({
                    compraData: response.data,
                    compraPagination: response.pagination
                });
            }),
            finalize(async () => {
                this.patch({ compraLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({ 
                    compraError: error
                }));
            }),
        ).subscribe();
    }

    public async loadCompraById(compraId) {
        this.patch({ compraLoadingSelected: true });

        this._compraRemoteReq.requestGetCompraById(compraId).pipe(
            tap(async ({ data }) => {
                this.patch({ compraSelected: data });
            }),
            finalize(async () => {
                this.patch({ compraLoadingSelected: false });
            }),
            catchError((error) => {
                return of(this.patch({ 
                    compraError: error
                    
                }));
            }),
        ).subscribe();
    }

    public get filterCompraToApply() {
        const state = this.vm();
        return state.filterCompraToApply;
    }

    public loadAllOrdenesDeCompra(): Observable<any> {
        this.loadSearchCompras(this.filterCompraToApply);
        return of(true);
    };

    public async loadCreateCompra(formData) {
        this.patch({
            createUpdateStateCompraLoading: true,
            createUpdateStateCompraError: null
        });

        if(formData.compra_fecha) {
            formData.compra_fecha = DateUtilityService.parseFechaFromServer(formData.compra_fecha);
        }

        this._compraRemoteReq.requestRegistrarCompra(formData).pipe(
            tap(async ({ data, message, code }) => {
                this.patch({
                    createUpdateStateCompraFlashMessage: message,
                    createUpdateStateCompraError: null,
                });

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateCompraFlashMessage: null,
                    });
                }, 3000);


                if(code === HTTP_RESPONSE.HTTP_200_OK) {
                    this._router.navigateByUrl("/compras/compras");
                }
               
            }),

            finalize(async () => {
                this.patch({
                    createUpdateStateCompraLoading: false
                })
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateCompraError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInCompra(pagination: any) {
        const filterVentaToApply = this.vm().filterCompraToApply;
        filterVentaToApply.page = pagination.pageIndex + 1;
        filterVentaToApply.perPage = pagination.pageSize;
        this.loadSearchCompras(filterVentaToApply);
        this.patch({ filterCompraToApply: filterVentaToApply });
    }

    public async loadUpdateOrdencompra(formData: any) {
        if(formData.ordencompra_fechavecimiento) {
            formData.ordencompra_fechavecimiento = DateUtilityService.parsearSoloFecha(formData.ordencompra_fechavecimiento) + ' 23:59:59';
        }

        if(formData.ordencompra_activo) {
            formData.ordencompra_activo = PARAM.ACTIVO;
        } else {
            formData.ordencompra_activo = PARAM.INACTIVO;
        }

        this.patch({
            createUpdateStateCompraLoading: true,
            createUpdateStateCompraError: null
        });

        this._compraRemoteReq.requestActualizarCompra(formData).pipe(
            tap(async ({ data, message }) => {
                // this.updateClienteInList(data);
                this.patch({
                    createUpdateStateCompraFlashMessage: message,
                    createUpdateStateCompraError: null,
                });

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateCompraFlashMessage: null,
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({
                    createUpdateStateCompraLoading: false,
                    createUpdateStateCompraFlashMessage: null,
                    compraCreated: true
                });
            }),

            catchError((error) => {
                return of(this.patch({
                    createUpdateStateCompraError: error
                }));
            }),
        ).subscribe();
    };


    


}
