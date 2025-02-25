import { MainMapper } from '@shared/mappers/main.mapper';
import {PARAM} from "@shared/constants/app.const";

export class Presentacion extends MainMapper<any, any> {
  protected map(presentacion: any): any {

    return {
      ...presentacion,
      tipodocumento_activo: presentacion.tipodocumento_activo == PARAM.ACTIVO
    }
  }

}
