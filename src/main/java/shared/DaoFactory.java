package shared;

import modules.usuario.dao.UsuarioDao;
import modules.persona.dao.PersonaDao;

import modules.usuario.dao.impl.UsuarioDaoImpl;
import modules.persona.dao.impl.PersonaDaoImpl;

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
    
}
