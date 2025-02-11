import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class MonedaMapper extends MainMapper<any, any> {
  protected map(moneda: any): any {
    return {
      ...moneda,
      moneda_activo: moneda.moneda_activo == PARAM.ACTIVO
    }
  }

}
