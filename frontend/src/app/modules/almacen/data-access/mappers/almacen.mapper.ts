import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class AlmacenMapper extends MainMapper<any, any> {
  protected map(almacen: any): any {
    return {
      ...almacen,
      almacen_activo: almacen.almacen_activo == PARAM.ACTIVO
    } 
  }

}
