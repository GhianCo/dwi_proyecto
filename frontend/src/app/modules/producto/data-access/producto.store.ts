import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, lastValueFrom, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { PARAM } from "@shared/constants/app.const";
import { SignalStore } from "@shared/data-access/signal.store";
import { ProductoRemoteReq } from "./producto.remote.req";
import { DateService } from "@shared/services/date.service";

export type IProductote = {
    productoLoading: boolean,
    productoData: any[],
    productoPagination: any,
    productoError: any,

    productoSelected: any,
    loadingProductoSelected: boolean,
    presentacionProductoSelected: any,
    presetacionIdSelected: any,
    refreshData: boolean,

    filterProductoToApply: any,

    createUpdateStateProductoLoading: boolean,
    createUpdateStateProductoFlashMessage: string,
    createUpdateStateProductoError: any,
}

const initialProductoState: IProductote = {
    productoLoading: false,
    productoData: [],
    productoPagination: null,
    productoError: null,

    productoSelected: null,
    loadingProductoSelected: false,
    presentacionProductoSelected: null,
    presetacionIdSelected: null,
    refreshData: false,

    filterProductoToApply: {
        query: PARAM.UNDEFINED,
        page: 1,
        perPage: 10
    },

    createUpdateStateProductoLoading: false,
    createUpdateStateProductoFlashMessage: null,
    createUpdateStateProductoError: null,
};

@Injectable({ providedIn: 'root' })
export class ProductoStore extends SignalStore<IProductote> {

    public readonly vm = this.selectMany([
        "productoLoading",
        "productoData",
        "productoPagination",
        "productoError",
        "productoSelected",
        "filterProductoToApply",
        "createUpdateStateProductoLoading",
        "createUpdateStateProductoFlashMessage",
        "createUpdateStateProductoError",
        "presentacionProductoSelected",
        "loadingProductoSelected",
        "presetacionIdSelected",
        "refreshData"
    ]);

    constructor(
        private _productoRemoteReq: ProductoRemoteReq,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
        super();
        this.initialize(initialProductoState);
    }

    public get productoSelected() {
        const state = this.vm();
        return state.productoSelected
    };
    
    public get presentacionProductoSelected() {
        const state = this.vm();
        return state.presentacionProductoSelected
    };

    public get productoData() {
        const state = this.vm();
        return state.productoData
    };

    public updateFilterProductoToApply(filterPedidoToApply: any) {
        this.patch({ filterProductoToApply: {
            ...this.vm().filterProductoToApply,
            ...filterPedidoToApply
        }});
    }

    public updatePresetacionIdSelected(presetacionIdSelected: any) {
        this.patch({ presetacionIdSelected });
    }

    public get filterProductoToApply() {
        const state = this.vm();
        return state.filterProductoToApply
    };

    public updateRefreshData(refreshData: boolean) {
        this.patch({ refreshData: refreshData });
    }

    public async loadSearchProducto(criteria) {
        this.patch({ productoLoading: true, productoError: null });
        this._productoRemoteReq.requestSearchProductoByCriteria(criteria).pipe(
            tap(async ({ data, pagination }) => {
                this.patch({
                    productoData: data,
                    productoPagination: pagination,
                })
            }),
            finalize(async () => {
                this.patch({ productoLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    productoError: error
                }));
            }),
        ).subscribe();
    };

    public loadAllProductoStore(): Observable<any> {
        this.loadSearchProducto(this.filterProductoToApply);
        return of(true);
    };

    public addProducto(): Observable<any> {
        const productoData: any[] = [...this.productoData];

        const productoSelected = {
            producto_id: null,
            producto_nombre: null,
            producto_activo: true,
            presentaciones: [],
        };

        productoData.unshift(productoSelected);

        this.patch({
            productoData: productoData,
            productoSelected: productoSelected
        })

    

        return of(true);
    };

    public searchProductoById(productoId: any, presentacionProductoId?: any): Observable<any> {
        return of(this.vm().productoData).pipe(
            take(1),
            map((productoData) => {
                const presentacionProductoSelected = productoData.find(item => item.presentacionproducto_id == presentacionProductoId);
                const productoSelected = presentacionProductoSelected.producto;

                this.patch({
                    productoSelected,
                    presentacionProductoSelected
                });

                return productoSelected;
            }),
            switchMap((producto) => {
                if (!producto) {
                    return throwError(() => 'No se encontro el producto con el id: ' + productoId + '!');
                }
                return of(producto);
            })
        );
    };    

    public changeQueryInProducto(searchValue) {
        const filterProductoToApply = this.vm().filterProductoToApply;
        filterProductoToApply.query = searchValue;
        if (!searchValue.length) {
            filterProductoToApply.query = PARAM.UNDEFINED;
        }
        filterProductoToApply.page = 1;
        this.loadSearchProducto(filterProductoToApply);
        this.patch({ filterProductoToApply });
    };

    public async loadCreateProducto(formData) {
        this.patch({
            createUpdateStateProductoLoading: true,
            createUpdateStateProductoError: null
        });

        if(formData.producto_fechavencimiento) {
            formData.producto_fechavencimiento = DateService.formatDateString(formData.producto_fechavencimiento, "yyyy-MM-dd");
        }

        this._productoRemoteReq.requestCreateProducto(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateProductoInList(data);
                this.patch({
                    productoSelected: data,
                    createUpdateStateProductoFlashMessage: message,
                    createUpdateStateProductoError: null,
                    refreshData: true
                });

                // this._router.navigate(['gestion/producto', data.producto_id], { relativeTo: this._activatedRoute });
                this._router.navigateByUrl('/producto/producto');

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateProductoFlashMessage: null
                    });
                }, 3000);
            }),
            finalize(async () => {
                this.patch({
                    createUpdateStateProductoLoading: false
                });
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateProductoError: error
                }));
            }),
        ).subscribe();
    };

    public discardFromListProductoToCreate() {
        const productoDataStored = this.vm().productoData;
        const productoData = productoDataStored.filter((productoData) => productoData.producto_id > 0);
        this.patch({
            productoData,
            productoSelected: null
        });
    }

    public updateProductoInList(productoToUpdate: any) {
        const productoData = this.vm().productoData;
        const presetacionIdSelected = this.vm().presetacionIdSelected;
        
        const producto = productoToUpdate;
        const presentaciones = productoToUpdate.presentaciones;

        const presentacionproductoIndex = presentaciones.findIndex(item => item.presentacionproducto_id == presetacionIdSelected);
        

        if (presentacionproductoIndex >= 0) {
            const presentacionSelected = presentaciones[presentacionproductoIndex];
            presentacionSelected.producto = producto;

            productoData[presentacionproductoIndex] = presentacionSelected;
        } else {
            const presentaciones = productoToUpdate.presentaciones;
            const newState = presentaciones.map((presentacion) => {
                presentacion.producto = producto;
                return presentacion;
            });

            productoData.push(...newState);
        }

        this.patch({
            productoData: productoData,
        });
    }

    public async loadUpdateProducto(formData: any) {
        this.patch({ createUpdateStateProductoLoading: true, createUpdateStateProductoError: null });

        if(formData.producto_fechavencimiento) {
            formData.producto_fechavencimiento = DateService.formatDateString(formData.producto_fechavencimiento, "yyyy-MM-dd");
        }

        this._productoRemoteReq.requestUpdateProducto(formData).pipe(
            tap(async ({ data, message }) => {
                this.updateProductoInList(data);
                const presentacionProductoSelected = data.presentaciones.find(item => item.presentacionproducto_id == this.vm().presetacionIdSelected);

                this.patch({
                    productoSelected: data,
                    presentacionProductoSelected: presentacionProductoSelected,
                    createUpdateStateProductoFlashMessage: message,
                    // refreshData: true
                });
                
                // this._router.navigateByUrl('gestion/producto', { relativeTo: this._activatedRoute });

                setTimeout(_ => {
                    this.patch({
                        createUpdateStateProductoFlashMessage: null
                    });
                }, 3000);

                // this._router.navigate(['/producto/producto']);

            }),
            finalize(async () => {
                this.patch({ createUpdateStateProductoLoading: false });
            }),
            catchError((error) => {
                return of(this.patch({
                    createUpdateStateProductoError: error
                }));
            }),
        ).subscribe();
    };

    public changePageInProducto(pagination: any) {
        const filterProductoToApply = this.vm().filterProductoToApply;
        filterProductoToApply.page = pagination.pageIndex + 1;
        filterProductoToApply.perPage = pagination.pageSize;
        this.loadSearchProducto(filterProductoToApply);
        this.patch({ filterProductoToApply });
    };


}
