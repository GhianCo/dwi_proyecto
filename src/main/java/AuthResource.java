
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import modules.usuario.models.Usuario;
import modules.usuario.services.impl.UsuarioServiceImpl;
import shared.ActionPayload;
import shared.pojos.LoginBodyReq;

@Path("auth")
public class AuthResource {

    @POST
    @Path("/login")
    public Response login(LoginBodyReq login) {

        Usuario usuario_login = new Usuario();

        Usuario usuarioObj = new Usuario();
        usuarioObj.setNick(login.getUsuario());
        usuarioObj.setClave(String.valueOf(login.getClave()));

        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        usuario_login = usuarioservice.login(usuarioObj);

        if (usuario_login.getNick() != null) {
            Algorithm algorithm = Algorithm.HMAC256("pwd_proyecto_2025!-!");

            String token = JWT.create()
                    .withSubject(String.valueOf(usuario_login.getId()))
                    .withClaim("nombres", usuario_login.getNombres())
                    .withClaim("apellidos", usuario_login.getApellidos())
                    .withClaim("rol", usuario_login.getRol())
                    .sign(algorithm);

            return Response
                    .status(Response.Status.OK)
                    .entity(new ActionPayload(200, token, "Inicio de sesion"))
                    .build();
        } else {
            return Response
                    .status(Response.Status.UNAUTHORIZED)
                    .entity(new ActionPayload(401, null, "Credenciales invalidas, intenta nuevamente."))
                    .build();
        }
    }
}
