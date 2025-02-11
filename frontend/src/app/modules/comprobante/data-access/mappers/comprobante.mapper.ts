import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class ComprobanteMapper extends MainMapper<any, any> {
  protected map(comprobante: any): any {
    return {
      ...comprobante,
      comprobante_activo: comprobante.comprobante_activo == PARAM.ACTIVO
    }
  }

}
