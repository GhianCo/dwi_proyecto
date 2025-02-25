package shared;

import modules.conductor.dao.ConductorDao;
import modules.conductor.dao.impl.ConductorDaoImpl;
import modules.embarcacion.dao.EmbarcacionDao;
import modules.embarcacion.dao.impl.EmbarcacionDaoImpl;
import modules.especie.dao.EspecieDao;
import modules.especie.dao.impl.EspecieDaoImpl;
import modules.usuario.dao.UsuarioDao;
import modules.persona.dao.PersonaDao;

import modules.usuario.dao.impl.UsuarioDaoImpl;
import modules.persona.dao.impl.PersonaDaoImpl;
import modules.presentacion.dao.PresentacionDao;
import modules.presentacion.dao.impl.PresentacionDaoImpl;
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
    
    public EmbarcacionDao getEmbarcacionDao() {
        return new EmbarcacionDaoImpl(); 
    }
   
    public EspecieDao getEspecieDao() {
        return new EspecieDaoImpl();
    }

    public TipoTransporteDao getTipoTransporteDao() {
        return new TipoTransporteDaoImpl();
    }
    
    public PresentacionDao getPresentacionDao() {
        return new PresentacionDaoImpl();
    }
    
}
