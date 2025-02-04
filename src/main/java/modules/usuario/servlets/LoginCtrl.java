package modules.usuario.servlets;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import http.JsonRequestWrapper;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.usuario.models.Usuario;
import modules.usuario.services.impl.UsuarioServiceImpl;
import org.json.JSONObject;
import shared.ActionPayload;
import shared.BaseServlet;
import jakarta.servlet.http.HttpSession;

public class LoginCtrl extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JsonRequestWrapper wrappedRequest = (JsonRequestWrapper) request;
        String jsonBody = wrappedRequest.getJsonBody();

        JSONObject jsonRequest = new JSONObject(jsonBody);

        String usuario = jsonRequest.optString("usuario");
        String clave = jsonRequest.optString("clave");

        Usuario usuario_login = new Usuario();

        Usuario usuarioObj = new Usuario();
        usuarioObj.setNick(usuario);
        usuarioObj.setClave(String.valueOf(clave));

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
            HttpSession session = request.getSession();
            session.setAttribute("token", token);
            
            sendJsonResponse(response, new ActionPayload(200, token, "Inicio de sesión"));
        } else {
            sendJsonResponse(response, new ActionPayload(401, null, "Credenciales inválidas, intenta nuevamente."));
        }

    }

}
