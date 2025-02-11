import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class TransportistaMapper extends MainMapper<any, any> {
  protected map(transportista: any): any {
    return {
      ...transportista,
      transportista_activo: transportista.transportista_activo == PARAM.ACTIVO
    }
  }

}
