package modules.especie.services.impl;

import modules.especie.models.Especie;
import java.util.ArrayList;
import modules.especie.dao.EspecieDao;
import modules.especie.dto.EspecieCreateRequestDTO;
import modules.especie.services.EspecieService;
import org.json.JSONObject;
import shared.DaoFactory;
import shared.JsonMapper;
import shared.PaginationResult;

public class EspecieServiceImpl implements EspecieService {

    EspecieDao especieDao;

    public EspecieServiceImpl() {
        this.instanceConn();
    }

    private void instanceConn() {
        DaoFactory daoFactory = DaoFactory.getInstance();
        especieDao = daoFactory.getEspecieDao();
    }

    @Override
    public void crear(Especie especie) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Especie createEspecie(EspecieCreateRequestDTO jsonRequest) {
        Especie especieToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Especie.class);
        int especieIdCreate = especieDao.create(especieToCreate);

        especieToCreate.setId(especieIdCreate);

        return especieToCreate;
    }

    @Override
    public Especie updateEspecie(EspecieCreateRequestDTO jsonRequest) {

        if (jsonRequest == null || jsonRequest.getId() == 0) {
            throw new IllegalArgumentException("El ID de la especie es necesario para actualizar.");
        }

        Especie especieToUpdate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Especie.class);
        especieToUpdate.setId(jsonRequest.getId());

        especieDao.update(especieToUpdate);

        return especieToUpdate;
    }

    @Override
    public Especie buscar(Object id) {
        return especieDao.find(id);
    }

    @Override
    public ArrayList<Especie> listar() {
        return especieDao.findAll();
    }

    @Override
    public void update(Especie especie) {
        especieDao.update(especie);
    }

    @Override
    public void borrar(Object id) {
        especieDao.delete(id);
    }

    @Override
    public PaginationResult paginate(String query, int page, int perPage) {
        return especieDao.paginate(query, page, perPage);
    }
}
