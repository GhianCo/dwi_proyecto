/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modules.embarcacion.services.impl;

import java.util.ArrayList;
import modules.embarcacion.dao.EmbarcacionDao;
import modules.embarcacion.dto.EmbarcacionGetAllDto;
import modules.embarcacion.models.Embarcacion;
import modules.embarcacion.services.EmbarcacionService;
import shared.DaoFactory;
import shared.PaginationResult;


/**
 *
 * @author Geancarlo Supo
 */
public class EmbarcacionServiceImpl implements EmbarcacionService {

    EmbarcacionDao embarcacionDao;

    public EmbarcacionServiceImpl() {
        this.instanceConn();
    }

    private void instanceConn() {
        DaoFactory daoFactory = DaoFactory.getInstance();
        embarcacionDao = daoFactory.getEmbarcacionDao();
    }

    @Override
    public void crear(Embarcacion entity) {
        embarcacionDao.create(entity);
    }

    @Override
    public Embarcacion buscar(Object id) {
        return embarcacionDao.find(id);
    }

    @Override
    public ArrayList<Embarcacion> listar() {
        return new ArrayList<>(embarcacionDao.findAll());
    }

    @Override
    public ArrayList<EmbarcacionGetAllDto> listarCompleto() {
        return new ArrayList<>(embarcacionDao.findAllWithAdditional());
    }
     
    @Override
    public PaginationResult paginate(String query, int page, int perPage) {
       return embarcacionDao.paginate(query, page, perPage);
    }
    
    @Override
    public PaginationResult paginateWithAdditional(String query, int page, int perPage) {
       return embarcacionDao.paginateWithAdditional(query, page, perPage);
    }

    @Override
    public void update(Embarcacion entity) {
        embarcacionDao.update(entity);
    }

    @Override
    public void borrar(Object id) {
        embarcacionDao.delete(id);
    }

    

 
    
}
