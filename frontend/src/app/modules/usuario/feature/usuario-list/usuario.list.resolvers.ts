import { inject } from '@angular/core';
import { UsuarioStore } from "../../data-access/usuario.store";

export const UsuarioListResolver = () => {
    const zonaStore = inject(UsuarioStore);
    return zonaStore.loadAllUsuario()
}
