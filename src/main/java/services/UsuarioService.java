package services;

import models.entities.Usuario;

public interface UsuarioService extends BaseService<Usuario> {
    public Usuario login(Usuario usuario);
}
