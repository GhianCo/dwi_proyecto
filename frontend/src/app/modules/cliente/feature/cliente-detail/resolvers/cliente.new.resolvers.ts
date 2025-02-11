import {inject} from "@angular/core";
import { ClienteStore } from "app/modules/cliente/data-access/cliente.store";
import { TransportistaStore } from "app/modules/transportista/data-access/transportista.store";

export const clienteNewResolver = () => {
    const clienteStore = inject(ClienteStore);
    clienteStore.cargarTiposDocumentoActivos();
    clienteStore.cargarZonasActivas();
    clienteStore.cargarVendedoresActivos();
    return clienteStore.addCliente();
}
