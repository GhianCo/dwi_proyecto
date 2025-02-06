package modules.embarcacion.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Optional;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.PathInfoExtractor;
import modules.embarcacion.models.Embarcacion;
import modules.embarcacion.services.EmbarcacionService;
import modules.embarcacion.services.impl.EmbarcacionServiceImpl;

public class GetOne extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        Optional<String> embarcacionIdOpt = Optional.of(params.get("id"));
        Integer embarcacionId = null;
        if(embarcacionIdOpt.isPresent()){
            embarcacionId = Integer.parseInt(embarcacionIdOpt.get());
        }
        EmbarcacionService embarcacionService = new EmbarcacionServiceImpl();
        Embarcacion embarcacion = embarcacionService.buscar(embarcacionId);
        sendJsonResponse(response, new ActionPayload(200, embarcacion, "Embarcación encontrada."));
    }

}
