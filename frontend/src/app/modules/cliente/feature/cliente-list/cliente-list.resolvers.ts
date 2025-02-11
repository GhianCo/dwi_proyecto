import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteStore } from '../../data-access/cliente.store';

export const ClienteListResolver = () => {
    const transportistaStore = inject(ClienteStore);
    return transportistaStore.loadAllClienteStore()
}
