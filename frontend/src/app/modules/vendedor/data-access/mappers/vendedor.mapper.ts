import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class VendedorMapper extends MainMapper<any, any> {
  protected map(vendedor: any): any {
    return {
      ...vendedor,
      vendedor_activo: vendedor.vendedor_activo == PARAM.ACTIVO
    }
  }

}
