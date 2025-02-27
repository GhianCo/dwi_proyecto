import { MainMapper } from '@shared/mappers/main.mapper';
import {PARAM} from "@shared/constants/app.const";

export class PuntoDesembarque extends MainMapper<any, any> {
  protected map(puntodesembarque: any): any {

    return {
      ...puntodesembarque,
      activo: puntodesembarque.activo == PARAM.ACTIVO
    }
  }

}
