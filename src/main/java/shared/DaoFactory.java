package shared;

import modules.conductor.dao.ConductorDao;
import modules.conductor.dao.impl.ConductorDaoImpl;
import modules.usuario.dao.UsuarioDao;
import modules.persona.dao.PersonaDao;

import modules.usuario.dao.impl.UsuarioDaoImpl;
import modules.persona.dao.impl.PersonaDaoImpl;
import modules.tipotransporte.dao.TipoTransporteDao;
import modules.tipotransporte.dao.impl.TipoTransporteDaoImpl;

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
    
    public PersonaDao getPersonaDao() {
        return new PersonaDaoImpl();
    }
    
    public ConductorDao getConductorDao() {
        return new ConductorDaoImpl();
    }
    
    public TipoTransporteDao getTipoTransporteDao() {
        return new TipoTransporteDaoImpl();
    }
    
}
