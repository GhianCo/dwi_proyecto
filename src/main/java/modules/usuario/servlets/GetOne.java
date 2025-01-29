package modules.usuario.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.PathInfoExtractor;

public class GetOne extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        String usuarioId = params.get("id");
        System.out.println("usu: "+ usuarioId);
        sendJsonResponse(response, new ActionPayload(200, usuarioId, "Lista de usuarios", null));
    }

}
