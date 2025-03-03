package modules.destino.services.impl;

import modules.destino.models.Destino;
import java.util.List;
import modules.destino.dao.DestinoDao;
import modules.destino.dto.DestinoCreateRequestDTO;
import modules.destino.services.DestinoService;
import org.json.JSONObject;
import shared.DaoFactory;
import shared.JsonMapper;
import shared.PaginationResult;

public class DestinoServiceImpl implements DestinoService {

    DestinoDao destinoDao;

    public DestinoServiceImpl() {
        this.instanceConn();
    }

    private void instanceConn() {
        DaoFactory daoFactory = DaoFactory.getInstance();
        destinoDao = daoFactory.getDestinoDao();
    }

    @Override
    public void crear(Destino destino) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Destino createDestino(DestinoCreateRequestDTO jsonRequest) {
        Destino destinoToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Destino.class);
        int destinoIdCreate = destinoDao.create(destinoToCreate);

        destinoToCreate.setId(destinoIdCreate);

        return destinoToCreate;
    }

    @Override
    public Destino updateDestino(DestinoCreateRequestDTO jsonRequest) {

        if (jsonRequest == null || jsonRequest.getId() == 0) {
            throw new IllegalArgumentException("El ID del destino es necesario para actualizar.");
        }

        Destino destinoToUpdate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Destino.class);
        destinoToUpdate.setId(jsonRequest.getId());

        destinoDao.update(destinoToUpdate);

        return destinoToUpdate;
    }

    @Override
    public Destino buscar(Object id) {
        return destinoDao.find(id);
    }

    @Override
    public List<Destino> listar() {
        return destinoDao.findAll();
    }

    @Override
    public void update(Destino destino) {
        destinoDao.update(destino);
    }

    @Override
    public void borrar(Object id) {
        destinoDao.delete(id);
    }

    @Override
    public PaginationResult paginate(String query, int page, int perPage) {
        return destinoDao.paginate(query, page, perPage);
    }
}
