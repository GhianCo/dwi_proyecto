import {inject} from "@angular/core";
import { ProductoStore } from "app/modules/producto/data-access/producto.store";

export const productoNewResolver = () => {
    const productoStore = inject(ProductoStore);
    return productoStore.addProducto();
}
