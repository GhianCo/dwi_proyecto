package modules.usuario.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import modules.usuario.services.impl.UsuarioServiceImpl;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.PathInfoExtractor;
import modules.usuario.models.Usuario;

public class GetOne extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        String usuarioId = params.get("id");
        
        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        Usuario usuario = usuarioservice.buscar(usuarioId);
        sendJsonResponse(response, new ActionPayload(200, usuario, "Usuario encontrado"));
    }

}
