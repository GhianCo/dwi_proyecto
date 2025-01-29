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

public class Delete extends BaseServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        String usuarioId = params.get("id");

        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        usuarioservice.borrar(usuarioId);
        sendJsonResponse(response, new ActionPayload(200, usuarioId, "Usuario eliminado"));
    }

}
