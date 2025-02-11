import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";

export class UsuarioMapper extends MainMapper<any, any> {
  protected map(usuario: any): any {
    return {
      ...usuario,
      usuario_activo: usuario.usuario_activo == PARAM.ACTIVO
    }
  }

}
