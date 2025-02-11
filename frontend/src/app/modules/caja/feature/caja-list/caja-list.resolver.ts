import { inject } from '@angular/core';
import { CajaStore } from '../../data-access/mapers/caja.store';

export const CajaListResolver = () => {
    const cajaStore = inject(CajaStore);
    return cajaStore.loadAllCajaStore()
}
