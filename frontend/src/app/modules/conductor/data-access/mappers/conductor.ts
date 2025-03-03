import { MainMapper } from '@shared/mappers/main.mapper';
import {PARAM} from "@shared/constants/app.const";

export class Conductor extends MainMapper<any, any> {
  protected map(conductor: any): any {

    return {
      ...conductor,
      activa: conductor.activo == PARAM.ACTIVO
    }
  }

}
