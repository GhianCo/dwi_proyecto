import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioStore } from "../../data-access/usuario.store";

export const UsuarioListResolver = () => {
    const zonaStore = inject(UsuarioStore);
    return zonaStore.loadAllUsuario()
}
