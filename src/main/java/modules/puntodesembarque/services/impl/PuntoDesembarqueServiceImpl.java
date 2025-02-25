/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modules.puntodesembarque.services.impl;

import java.util.ArrayList;
import modules.puntodesembarque.dao.PuntoDesembarqueDao;
import modules.puntodesembarque.models.PuntoDesembarque;
import modules.puntodesembarque.services.PuntoDesembarqueService;
import shared.DaoFactory;
import shared.PaginationResult;


/**
 *
 * @author Geancarlo Supo
 */
public class PuntoDesembarqueServiceImpl implements PuntoDesembarqueService {

    PuntoDesembarqueDao puntoDesembarqueDao;

    public PuntoDesembarqueServiceImpl() {
        this.instanceConn();
    }

    private void instanceConn() {
        DaoFactory daoFactory = DaoFactory.getInstance();
        puntoDesembarqueDao = daoFactory.getPuntoDesembarqueDao();
    }

    @Override
    public void crear(PuntoDesembarque entity) {
        puntoDesembarqueDao.create(entity);
    }

    @Override
    public PuntoDesembarque buscar(Object id) {
        return puntoDesembarqueDao.find(id);
    }

    @Override
    public ArrayList<PuntoDesembarque> listar() {
        return new ArrayList<>(puntoDesembarqueDao.findAll());
    }

    @Override
    public PaginationResult paginate(String query, int page, int perPage) {
       return puntoDesembarqueDao.paginate(query, page, perPage);
    }

    @Override
    public void update(PuntoDesembarque entity) {
        puntoDesembarqueDao.update(entity);
    }

    @Override
    public void borrar(Object id) {
        puntoDesembarqueDao.delete(id);
    }

 
    
}
