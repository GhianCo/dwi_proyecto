package modules.especie.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import modules.especie.services.impl.EspecieServiceImpl;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.PathInfoExtractor;

public class Delete extends BaseServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        String especieId = params.get("id");

        EspecieServiceImpl especieService = new EspecieServiceImpl();
        especieService.borrar(especieId);
        sendJsonResponse(response, new ActionPayload(200, especieId, "Especie eliminada"));
    }
}
