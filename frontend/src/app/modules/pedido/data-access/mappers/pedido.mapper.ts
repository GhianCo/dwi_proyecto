import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class PedidoMapper extends MainMapper<any, any> {
  protected map(pedido: any): any {
    return {
      ...pedido,
      pedido_pendiente: pedido.pedido_pendiente == PARAM.SI,
      pedido_activo: pedido.pedido_activo == PARAM.ACTIVO
    }
  }

}
