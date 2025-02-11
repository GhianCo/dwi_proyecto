import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class CajaMapper extends MainMapper<any, any> {
  protected map(caja: any): any {
    return {
      ...caja,
      caja_activo: caja.caja_activo == PARAM.ACTIVO
    } 
  }

}
