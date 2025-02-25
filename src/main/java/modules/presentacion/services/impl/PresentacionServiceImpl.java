package modules.presentacion.services.impl;

import modules.presentacion.models.Presentacion;
import java.util.List;
import modules.presentacion.dao.PresentacionDao;
import modules.presentacion.dto.PresentacionCreateRequestDTO;
import modules.presentacion.services.PresentacionService;
import org.json.JSONObject;
import shared.DaoFactory;
import shared.JsonMapper;
import shared.PaginationResult;

public class PresentacionServiceImpl implements PresentacionService {

    PresentacionDao presentacionDao;

    public PresentacionServiceImpl() {
        this.instanceConn();
    }

    private void instanceConn() {
        DaoFactory daoFactory = DaoFactory.getInstance();
        presentacionDao = daoFactory.getPresentacionDao();
    }

    @Override
    public void crear(Presentacion presentacion) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Presentacion createPresentacion(PresentacionCreateRequestDTO jsonRequest) {
        Presentacion presentacionToCreate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Presentacion.class);
        int presentacionIdCreate = presentacionDao.create(presentacionToCreate);

        presentacionToCreate.setId(presentacionIdCreate);

        return presentacionToCreate;
    }

    @Override
    public Presentacion updatePresentacion(PresentacionCreateRequestDTO jsonRequest) {

        if (jsonRequest == null || jsonRequest.getId() == 0) {
            throw new IllegalArgumentException("El ID de la presentacion es necesario para actualizar.");
        }

        Presentacion presentacionToUpdate = JsonMapper.mapJsonToDto(new JSONObject(jsonRequest), Presentacion.class);
        presentacionToUpdate.setId(jsonRequest.getId());

        presentacionDao.update(presentacionToUpdate);

        return presentacionToUpdate;
    }

    @Override
    public Presentacion buscar(Object id) {
        return presentacionDao.find(id);
    }

    @Override
    public List<Presentacion> listar() {
        return presentacionDao.findAll();
    }

    @Override
    public void update(Presentacion presentacion) {
        presentacionDao.update(presentacion);
    }

    @Override
    public void borrar(Object id) {
        presentacionDao.delete(id);
    }

    @Override
    public PaginationResult paginate(String query, int page, int perPage) {
        return presentacionDao.paginate(query, page, perPage);
    }
}
