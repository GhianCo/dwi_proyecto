import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransportistaStore } from "../../data-access/transportista.store";

export const TransportistaListResolver = () => {
    const transportistaStore = inject(TransportistaStore);
    return transportistaStore.loadAllTransportistaStore()
}
