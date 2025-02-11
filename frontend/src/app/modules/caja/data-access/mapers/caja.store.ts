


import { Injectable } from '@angular/core';
import { SignalStore } from "@shared/data-access/signal.store";
import { CajaRemoteReq } from '../caja.remote.req';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { PARAM } from '@shared/constants/app.const';

type ICajaState = {
  cajaLoading: boolean,
  cajaData: any[],
  cajaPagination: any,
  cajaError: any,

  cajaSelected: any,
  filterCajaToApply: any,

  createUpdateStateCajaLoading: boolean,
  createUpdateStateCajaFlashMessage: string,
  createUpdateStateCajaError: any,

  locales: any[],

}

const initalState: ICajaState = {
  cajaLoading: false,
  cajaData: [],
  cajaPagination: null,
  cajaError: null,

  cajaSelected: null,

  filterCajaToApply: {
    query: PARAM.UNDEFINED,
    page: 1,
    perPage: 10
  },

  createUpdateStateCajaLoading: false,
  createUpdateStateCajaFlashMessage: null,
  createUpdateStateCajaError: false,

  locales: [],
}



@Injectable({
  providedIn: 'root'
})
export class CajaStore extends SignalStore<ICajaState> {

  public readonly vm = this.selectMany([
    "cajaLoading",
    "cajaData",
    "cajaPagination",
    "cajaError",
    "cajaSelected",
    "filterCajaToApply",
    "createUpdateStateCajaLoading",
    "createUpdateStateCajaFlashMessage",
    "createUpdateStateCajaError",
  ]);

  constructor(
    private _cajaRemoteReq: CajaRemoteReq,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    super();
    this.initialize(initalState);
  }

  public get cajaSelected() {
    const state = this.vm();
    return state.cajaSelected
  };

  public get cajaData() {
    const state = this.vm();
    return state.cajaData
  };

  public get filtercajaToApply() {
    const state = this.vm();
    return state.filterCajaToApply;
  };

  public async loadSearchCaja(criteria) {
    this.patch({ cajaLoading: true, cajaError: null });
    this._cajaRemoteReq.requestSearchCajaByCriteria(criteria).pipe(
      tap(async ({ data, pagination }) => {
        this.patch({
          cajaData: data,
          cajaPagination: pagination,
        })
      }),
      finalize(async () => {
        this.patch({ cajaLoading: false });
      }),
      catchError((error) => {
        return of(this.patch({
          cajaError: error
        }));
      }),
    ).subscribe();
  };

  public loadAllCajaStore(): Observable<any> {
    this.loadSearchCaja(this.filtercajaToApply);
    return of(true);
  };

  public addCaja(): Observable<any> {
    const cajaData: any[] = [...this.cajaData];

    const cajaSelected = {
      zona_id: null,
      zona_descripcion: null,
      zona_estado: "1",
      zona_activo: true,
      local: {
        local_nombrecomercial: "",
      }
    };

    cajaData.unshift(cajaSelected);

    this.patch({
      cajaData,
      cajaSelected
    })
    return of(true);
  };

  public searchCajaById(cajaId): Observable<any> {
    return of(this.vm().cajaData).pipe(
      take(1),
      map((caja) => {
        const cajaSelected = caja.find(item => item.caja_id == cajaId) || null;

        this.patch({
          cajaSelected
        });

        return cajaSelected;
      }),
      switchMap((zona) => {
        if (!zona) {
          return throwError(() => 'No se encontro la caja con el id: ' + cajaId + '!');
        }
        return of(zona);
      })
    );
  };

  public changeQueryInCaja(searchValue) {
    const filterCajaToApply = this.vm().filterCajaToApply;
    filterCajaToApply.query = searchValue;
    if (!searchValue.length) {
      filterCajaToApply.query = PARAM.UNDEFINED;
    }
    filterCajaToApply.page = 1;
    this.loadSearchCaja(filterCajaToApply);
    this.patch({ filterCajaToApply });
  };

  public async loadCreateCaja(formData) {
    this.patch({
      createUpdateStateCajaLoading: true,
      createUpdateStateCajaError: null
    });
    // formData.caja_estado = formData.caja_estado ? PARAM.ACTIVO : PARAM.INACTIVO;

    this._cajaRemoteReq.requestCreateCaja(formData).pipe(
      tap(async ({ data, message }) => {
        this.updateCajaInList(data);
        this.patch({
          cajaSelected: data,
          createUpdateStateCajaFlashMessage: message,
          createUpdateStateCajaError: null,
        });

        this._router.navigate(['gestion/caja', data.caja_id], { relativeTo: this._activatedRoute });

        setTimeout(_ => {
          this.patch({
            createUpdateStateCajaFlashMessage: null
          });
        }, 3000);
      }),
      finalize(async () => {
        this.patch({
          createUpdateStateCajaLoading: false
        });
      }),
      catchError((error) => {
        return of(this.patch({
          createUpdateStateCajaError: error
        }));
      }),
    ).subscribe();
  };

  public updateCajaInList(cajaToUpdate: any) {
    const cajaData = this.vm().cajaData;
    const zonaIndex = cajaData.findIndex(caja => !caja.caja_id || caja.caja_id == cajaToUpdate.caja_id);

    if (zonaIndex >= 0) {
      cajaData[zonaIndex] = cajaToUpdate;
    }
    this.patch({
      cajaData,
    });
  }
  public async loadUpdateCaja(formData: any) {
    this.patch({
      createUpdateStateCajaLoading: true,
      createUpdateStateCajaError: null
    });

    // formData.zona_estado = formData.zona_activo ? PARAM.ACTIVO : PARAM.INACTIVO;

    this._cajaRemoteReq.requestUpdateCaja(formData).pipe(
      tap(async ({ data, message }) => {
        this.updateCajaInList(data);
        this.patch({
          cajaSelected: data,
          createUpdateStateCajaFlashMessage: message,
        });
        setTimeout(_ => {
          this.patch({
            createUpdateStateCajaFlashMessage: null
          });
        }, 3000);
      }),
      finalize(async () => {
        this.patch({ createUpdateStateCajaLoading: false });
      }),
      catchError((error) => {
        return of(this.patch({
          createUpdateStateCajaError: error
        }));
      }),
    ).subscribe();
  };

  public changePageInCaja(pagination: any) {
    const filterCajaToApply = this.vm().filterCajaToApply;
    filterCajaToApply.page = pagination.pageIndex + 1;
    filterCajaToApply.perPage = pagination.pageSize;
    this.loadSearchCaja(filterCajaToApply);
    this.patch({ filterCajaToApply });
  };

  public discardFromListCajaToCreate() {
    const cajaDataStored = this.vm().cajaData;
    const cajaData = cajaDataStored.filter((cajaData) => cajaData.caja_id > 0);
    this.patch({
      cajaData,
      cajaSelected: null
    });
  }

}
