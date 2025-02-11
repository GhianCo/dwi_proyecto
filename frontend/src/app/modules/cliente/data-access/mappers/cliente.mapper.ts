import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class ClienteMapper extends MainMapper<any, any> {
  protected map(cliente: any): any {
    return {
      ...cliente,
      cliente_activo: cliente.cliente_activo == PARAM.ACTIVO,
      cliente_bloqueadopordeudapendiente: cliente.cliente_bloqueadopordeudapendiente == PARAM.ACTIVO,
      cliente_bloqueadoporlineadecredito:   cliente.cliente_bloqueadoporlineadecredito == PARAM.ACTIVO,
    }
  }

}
