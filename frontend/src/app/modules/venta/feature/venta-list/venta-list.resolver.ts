import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VentaStore } from '../../data-access/venta.store';

export const VentaListResolver = () => {
    const ventaStore = inject(VentaStore);
    return ventaStore.loadAllVenta()
}
