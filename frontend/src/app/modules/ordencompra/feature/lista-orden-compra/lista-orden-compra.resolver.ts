import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdencompraStore } from '../../data-access/ordencompra.store';
import { PARAM } from '@shared/constants/app.const';

export const ListaOrdencompraResolver = () => {
    const ordencompraStore = inject(OrdencompraStore);
    const filtersToAplly = {
        ordencompra_estado: PARAM.UNDEFINED,
        codigo: PARAM.UNDEFINED,
    }
    ordencompraStore.updateFilterOrdencompraToApply(filtersToAplly);
    return ordencompraStore.loadAllOrdenesDeCompra()
}
