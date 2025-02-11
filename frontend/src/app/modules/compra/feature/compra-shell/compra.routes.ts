
import { Routes } from "@angular/router";
import { NuevaCompraComponent } from "../nueva-compra/nueva-compra.component";
import { ListaComprasComponent } from "../lista-compras/lista-compras.component";


export default [
  {
    path: "",
    component: ListaComprasComponent,
    resolve: {
    }
  },
  {
    path: "nueva",
    component: NuevaCompraComponent
  },
  {
    path: "editar/:id",
    component: NuevaCompraComponent,
    resolve: {
    }
  },
  {
    path: "canjeOrdenCompra/:ordenCompraId",
    component: NuevaCompraComponent,
    resolve: {
    }
  }


] as Routes