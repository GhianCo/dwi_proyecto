package modules.usuario.dao;

import modules.usuario.models.Usuario;
import shared.EntityDao;

public interface UsuarioDao extends EntityDao<Usuario> {
    public Usuario login(Usuario usuario);
}
