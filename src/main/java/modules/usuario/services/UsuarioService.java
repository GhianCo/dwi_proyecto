package modules.usuario.services;

import modules.usuario.models.Usuario;
import shared.BaseService;

public interface UsuarioService extends BaseService<Usuario> {
    public Usuario login(Usuario usuario);
}
