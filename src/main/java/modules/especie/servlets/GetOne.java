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
import modules.especie.models.Especie;

public class GetOne extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        String especieId = params.get("id");
        
        EspecieServiceImpl especieService = new EspecieServiceImpl();
        Especie especie = especieService.buscar(especieId);
        sendJsonResponse(response, new ActionPayload(200, especie, "Especie encontrada"));
    }

}
