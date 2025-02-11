import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProveedorStore } from "../../data-access/proveedor.store";

export const TransportistaListResolver = () => {
    const transportistaStore = inject(ProveedorStore);
    return transportistaStore.loadAllProveedorStore()
}
