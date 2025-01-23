package models.dao;

import models.entities.Usuario;

public interface UsuarioDao extends EntityDao<Usuario> {
    public Usuario login(Usuario usuario);
}
