import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoStore } from '../../data-access/pedido.store';

export const ListaPedidosResolver = () => {
    const pedidoStore = inject(PedidoStore);
    return pedidoStore.loadAllPedidos()
}
