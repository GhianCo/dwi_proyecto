import {inject} from "@angular/core";
import { ProveedorStore } from "app/modules/proveedor/data-access/proveedor.store";
import { TransportistaStore } from "app/modules/transportista/data-access/transportista.store";

export const proveedorNewResolver = () => {
    const proveedorStore = inject(ProveedorStore);
    proveedorStore.cargarTiposDocumentoActivos();
    return proveedorStore.addProveedor();
}
