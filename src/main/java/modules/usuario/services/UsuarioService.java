package modules.usuario.services;

import modules.usuario.dto.UsuarioCreateRequestDTO;
import modules.usuario.models.Usuario;
import shared.BaseService;

public interface UsuarioService extends BaseService<Usuario> {
    public Usuario login(Usuario usuario);
    public Usuario createUsuarioAndPersona(UsuarioCreateRequestDTO entity);
    public Usuario updateUsuarioAndPersona(UsuarioCreateRequestDTO entity);
}
