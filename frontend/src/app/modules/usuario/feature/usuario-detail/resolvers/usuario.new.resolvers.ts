import {inject} from "@angular/core";
import { UsuarioStore } from "app/modules/usuario/data-access/usuario.store";

export const usuarioNewResolver = () => {
    const usuarioStore = inject(UsuarioStore);
    return usuarioStore.addUsuario();
}
