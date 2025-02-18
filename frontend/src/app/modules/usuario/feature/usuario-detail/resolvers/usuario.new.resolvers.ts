import {inject} from "@angular/core";
import { UsuarioStore } from "app/modules/usuario/data-access/usuario.store";
import { ZonaStore } from "app/modules/zona/data-access/zona.store";

export const usuarioNewResolver = () => {
    const usuarioStore = inject(UsuarioStore);
    return usuarioStore.addUsuario();
}
