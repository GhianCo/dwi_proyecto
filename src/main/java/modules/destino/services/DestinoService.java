package modules.destino.services;

import modules.destino.dto.DestinoCreateRequestDTO;
import modules.destino.models.Destino;
import shared.BaseService;

public interface DestinoService extends BaseService<Destino> {
    public Destino createDestino(DestinoCreateRequestDTO entity);
    public Destino updateDestino(DestinoCreateRequestDTO entity);
}
