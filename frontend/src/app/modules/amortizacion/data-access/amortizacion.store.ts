import { Injectable } from '@angular/core';
import { SignalStore } from "@shared/data-access/signal.store";
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { PARAM } from '@shared/constants/app.const';
import { AmorizacionRemoteReq } from './amortizacion.remote.req';

type IAmortizacion = {
  ventasParaAmortizarLoading: boolean,
  ventasParaAmortizar: any[],
  ventasParaAmortizarPagination: any,
  ventasParaAmortizarError: any,

  ventaParaAmortizarSelected: any,
  loadingventaParaAmortizarSelected: any,  
  filterVentasParaAmortizarToApply: any,

  // createUpdateStateCajaLoading: boolean,
  // createUpdateStateCajaFlashMessage: string,
  // createUpdateStateCajaError: any,

}

const initalState: IAmortizacion = {
  ventasParaAmortizarLoading: false,
  ventasParaAmortizar: [],
  ventasParaAmortizarPagination: null,
  ventasParaAmortizarError: null,

  ventaParaAmortizarSelected: null,
  loadingventaParaAmortizarSelected: false,

  filterVentasParaAmortizarToApply: {
    // query: PARAM.UNDEFINED,
    page: 1,
    perPage: 10,
    ventaAmortizada: PARAM.UNDEFINED
  },

  // createUpdateStateCajaLoading: false,
  // createUpdateStateCajaFlashMessage: null,
  // createUpdateStateCajaError: false,

  
}


@Injectable({
  providedIn: 'root'
})
export class AmortizacionStore extends SignalStore<IAmortizacion> {

  public readonly vm = this.selectMany([
    "ventasParaAmortizarLoading",
    "ventasParaAmortizar",
    "ventasParaAmortizarPagination",
    "ventasParaAmortizarError",
    "ventaParaAmortizarSelected",
    "loadingventaParaAmortizarSelected",
    "filterVentasParaAmortizarToApply",
  ]);

  constructor(
    private _amortizacionRemoteReq: AmorizacionRemoteReq,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    super();
    this.initialize(initalState);
  }

  public get ventaParaAmortizarSelected() {
    const state = this.vm();
    return state.ventaParaAmortizarSelected
  };

  public get ventasParaAmortizar() {
    const state = this.vm();
    return state.ventasParaAmortizar
  };

  public get filterVentasParaAmortizarToApply() {
    const state = this.vm();
    return state.filterVentasParaAmortizarToApply;
  };

  public async loadSearchVentasParaAmortizar(criteria) {
    this.patch({ ventasParaAmortizarLoading: true, ventasParaAmortizarError: null });
    this._amortizacionRemoteReq.requestObtenerVentasParaAmortizar(criteria).pipe(
      tap(async ({ data, pagination }) => {
        this.patch({
          ventasParaAmortizar: data,
          ventasParaAmortizarPagination: pagination,
        })
      }),
      finalize(async () => {
        this.patch({ ventasParaAmortizarLoading: false });
      }),
      catchError((error) => {
        return of(this.patch({
          ventasParaAmortizarError: error
        }));
      }),
    ).subscribe();
  };

  public loadAllVentasParaAmorizar(): Observable<any> {
    this.loadSearchVentasParaAmortizar(this.filterVentasParaAmortizarToApply);
    return of(true);
  };

  // public addCaja(): Observable<any> {
  //   const cajaData: any[] = [...this.cajaData];

  //   const cajaSelected = {
  //     zona_id: null,
  //     zona_descripcion: null,
  //     zona_estado: "1",
  //     zona_activo: true,
  //     local: {
  //       local_nombrecomercial: "",
  //     }
  //   };

  //   cajaData.unshift(cajaSelected);

  //   this.patch({
  //     ventasParaAmortizar: cajaData,
  //     ventaParaAmortizarSelected: cajaSelected
  //   })
  //   return of(true);
  // };

  // public searchCajaById(cajaId): Observable<any> {
  //   return of(this.vm().ventasParaAmortizar).pipe(
  //     take(1),
  //     map((caja) => {
  //       const cajaSelected = caja.find(item => item.caja_id == cajaId) || null;

  //       this.patch({
  //         ventaParaAmortizarSelected: cajaSelected
  //       });

  //       return cajaSelected;
  //     }),
  //     switchMap((zona) => {
  //       if (!zona) {
  //         return throwError(() => 'No se encontro la caja con el id: ' + cajaId + '!');
  //       }
  //       return of(zona);
  //     })
  //   );
  // };

  public updateFilterVentasParaAmortizarToApply(filterVentasParaAmortizarToApply: any) {
    this.patch({ filterVentasParaAmortizarToApply: {
        ...this.vm().filterVentasParaAmortizarToApply,
        ...filterVentasParaAmortizarToApply
    }});
  }



  public changeQueryInCaja(searchValue) {
    const filterCajaToApply = this.vm().filterVentasParaAmortizarToApply;
    filterCajaToApply.query = searchValue;
    if (!searchValue.length) {
      filterCajaToApply.query = PARAM.UNDEFINED;
    }
    filterCajaToApply.page = 1;
    this.loadSearchVentasParaAmortizar(filterCajaToApply);
    this.patch({ filterVentasParaAmortizarToApply: filterCajaToApply });
  };

  // public async loadCreateCaja(formData) {
  //   this.patch({
  //     createUpdateStateCajaLoading: true,
  //     createUpdateStateCajaError: null
  //   });
  //   // formData.caja_estado = formData.caja_estado ? PARAM.ACTIVO : PARAM.INACTIVO;

  //   this._amortizacionRemoteReq.requestCreateCaja(formData).pipe(
  //     tap(async ({ data, message }) => {
  //       this.updateCajaInList(data);
  //       this.patch({
  //         ventaParaAmortizarSelected: data,
  //         createUpdateStateCajaFlashMessage: message,
  //         createUpdateStateCajaError: null,
  //       });

  //       this._router.navigate(['gestion/caja', data.caja_id], { relativeTo: this._activatedRoute });

  //       setTimeout(_ => {
  //         this.patch({
  //           createUpdateStateCajaFlashMessage: null
  //         });
  //       }, 3000);
  //     }),
  //     finalize(async () => {
  //       this.patch({
  //         createUpdateStateCajaLoading: false
  //       });
  //     }),
  //     catchError((error) => {
  //       return of(this.patch({
  //         createUpdateStateCajaError: error
  //       }));
  //     }),
  //   ).subscribe();
  // };

  // public updateCajaInList(cajaToUpdate: any) {
  //   const cajaData = this.vm().ventasParaAmortizar;
  //   const zonaIndex = cajaData.findIndex(caja => !caja.caja_id || caja.caja_id == cajaToUpdate.caja_id);

  //   if (zonaIndex >= 0) {
  //     cajaData[zonaIndex] = cajaToUpdate;
  //   }
  //   this.patch({
  //     ventasParaAmortizar: cajaData,
  //   });
  // }
  // public async loadUpdateCaja(formData: any) {
  //   this.patch({
  //     createUpdateStateCajaLoading: true,
  //     createUpdateStateCajaError: null
  //   });

  //   // formData.zona_estado = formData.zona_activo ? PARAM.ACTIVO : PARAM.INACTIVO;

  //   this._amortizacionRemoteReq.requestUpdateCaja(formData).pipe(
  //     tap(async ({ data, message }) => {
  //       this.updateCajaInList(data);
  //       this.patch({
  //         ventaParaAmortizarSelected: data,
  //         createUpdateStateCajaFlashMessage: message,
  //       });
  //       setTimeout(_ => {
  //         this.patch({
  //           createUpdateStateCajaFlashMessage: null
  //         });
  //       }, 3000);
  //     }),
  //     finalize(async () => {
  //       this.patch({ createUpdateStateCajaLoading: false });
  //     }),
  //     catchError((error) => {
  //       return of(this.patch({
  //         createUpdateStateCajaError: error
  //       }));
  //     }),
  //   ).subscribe();
  // };

  public changePageInObtenerVentasParaAmortizar(pagination: any) {
    const filterCajaToApply = this.vm().filterVentasParaAmortizarToApply;
    filterCajaToApply.page = pagination.pageIndex + 1;
    filterCajaToApply.perPage = pagination.pageSize;
    this.loadSearchVentasParaAmortizar(filterCajaToApply);
    this.patch({ filterVentasParaAmortizarToApply: filterCajaToApply });
  };

  // public discardFromListCajaToCreate() {
  //   const cajaDataStored = this.vm().ventasParaAmortizar;
  //   const cajaData = cajaDataStored.filter((cajaData) => cajaData.caja_id > 0);
  //   this.patch({
  //     ventasParaAmortizar: cajaData,
  //     ventaParaAmortizarSelected: null
  //   });
  // }

}
