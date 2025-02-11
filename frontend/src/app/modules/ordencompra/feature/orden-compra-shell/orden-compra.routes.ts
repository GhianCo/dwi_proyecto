import { Routes } from "@angular/router";
import { ListaOrdencompraComponent } from "../lista-orden-compra/lista-orden-compra.component";
import { ListaOrdencompraResolver } from "../lista-orden-compra/lista-orden-compra.resolver";
import { NuevaOrdenCompraComponent } from "../nueva-orden-compra/nueva-orden-compra.component";


export default [
  {
    path: "",
    component: ListaOrdencompraComponent,
    resolve: {
      provider: ListaOrdencompraResolver
    }
  },
  {
    path: "nueva",
    component: NuevaOrdenCompraComponent,
    resolve: {
    }
  },
  {
    path: "editar/:id", 
    component: NuevaOrdenCompraComponent,
    resolve: {
    }
  }
] as Routes