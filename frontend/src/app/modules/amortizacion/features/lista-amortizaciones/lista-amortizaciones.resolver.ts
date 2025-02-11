import { inject, Injectable } from '@angular/core';
import { AmortizacionStore } from '../../data-access/amortizacion.store';

export const ListaPedidosResolver = () => {
    const amortizacionStore = inject(AmortizacionStore);
    return amortizacionStore.loadAllVentasParaAmorizar()
}
