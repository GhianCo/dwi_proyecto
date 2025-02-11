import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class ProveedorMapper extends MainMapper<any, any> {
  protected map(proveedor: any): any {
    return {
      ...proveedor,
      proveedor_activo: proveedor.proveedor_activo == PARAM.ACTIVO
    }
  }

}
