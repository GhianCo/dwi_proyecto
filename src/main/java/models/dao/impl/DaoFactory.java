package models.dao.impl;

import models.dao.UsuarioDao;

public class DaoFactory {

    private DaoFactory() {
    }

    public static DaoFactory getInstance() {
        return DaoFactoryHolder.INSTANCE;
    }

    private static class DaoFactoryHolder {
        private static final DaoFactory INSTANCE = new DaoFactory();
    }
    
    public UsuarioDao getUsuarioDao() {
        return new UsuarioDaoImpl();
    }
    
}
