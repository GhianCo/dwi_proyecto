import { MainMapper } from '@shared/mappers/main.mapper';
import { PARAM } from "@shared/constants/app.const";
import { DateService } from '@shared/services/date.service';
import { UtilityService } from '@shared/services/utility.service';

export class ProductoMapper extends MainMapper<any, any> {
  protected map(producto: any): any {
    return {
      ...producto,
      producto_activo: producto.producto_activo == PARAM.ACTIVO,
      producto_incluyeivg: producto.producto_incluyeivg == PARAM.ACTIVO,
      producto_necesitareceta: producto.producto_necesitareceta == PARAM.ACTIVO,
      producto_generico: producto.producto_generico == PARAM.ACTIVO,
      presentaciones: producto.presentaciones.map((presentacion: any) => ({
        ...presentacion,
        presentacion_activo: presentacion.presentacionproducto_activo == PARAM.ACTIVO,
      })) ?? [],
      producto_manejalotes: producto.producto_manejalotes == PARAM.ACTIVO,
      producto_sujetodetraccion: producto.producto_sujetodetraccion == PARAM.ACTIVO,
      producto_fechacreacion: producto.producto_fechacreacion ? DateService.dateFromServer(producto.producto_fechacreacion) : null,
      producto_fechavencimiento: producto.producto_fechavencimiento ? DateService.dateFromServer(producto.producto_fechavencimiento) : null,
      producto_imagen: producto.producto_imagen
    }
  }
}
