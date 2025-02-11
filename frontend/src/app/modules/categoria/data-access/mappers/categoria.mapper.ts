import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class CategoriaMapper extends MainMapper<any, any> {
  protected map(categoria: any): any {
    return {
      ...categoria,
      categoria_activo: categoria.categoria_activo == PARAM.ACTIVO
    }
  }

}
