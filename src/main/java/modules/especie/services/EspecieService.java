package modules.especie.services;

import modules.especie.dto.EspecieCreateRequestDTO;
import modules.especie.models.Especie;
import shared.BaseService;

public interface EspecieService extends BaseService<Especie> {
    public Especie createEspecie(EspecieCreateRequestDTO entity);
    public Especie updateEspecie(EspecieCreateRequestDTO entity);
}
