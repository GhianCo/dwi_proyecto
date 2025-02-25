package modules.presentacion.services;

import modules.presentacion.dto.PresentacionCreateRequestDTO;
import modules.presentacion.models.Presentacion;
import shared.BaseService;

public interface PresentacionService extends BaseService<Presentacion> {
    public Presentacion createPresentacion(PresentacionCreateRequestDTO entity);
    public Presentacion updatePresentacion(PresentacionCreateRequestDTO entity);
}

