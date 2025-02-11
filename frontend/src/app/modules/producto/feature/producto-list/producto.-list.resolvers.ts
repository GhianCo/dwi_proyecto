import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoStore } from "../../data-access/producto.store";

export const ProductoListResolver = () => {
    const zonaStore = inject(ProductoStore);
    return zonaStore.loadAllProductoStore()
}
