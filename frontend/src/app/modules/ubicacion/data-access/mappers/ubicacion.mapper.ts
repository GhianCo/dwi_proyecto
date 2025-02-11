import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class UbicacionMapper extends MainMapper<any, any> {
  protected map(ubicacion: any): any {
    return {
      ...ubicacion,
      ubicacion_activo: ubicacion.ubicacion_activo == PARAM.ACTIVO
    }
  }

}
