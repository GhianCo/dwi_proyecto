import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class VentaMapper extends MainMapper<any, any> {
  protected map(venta: any): any {
    return {
      ...venta,
      venta_activo: venta.venta_activo == PARAM.ACTIVO
    }
  }

}
