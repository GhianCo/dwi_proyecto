package modules.embarcacion.servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Optional;
import modules.embarcacion.services.EmbarcacionService;
import modules.embarcacion.services.impl.EmbarcacionServiceImpl;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.PathInfoExtractor;

public class Delete extends BaseServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Map<String, String> params = PathInfoExtractor.extractParams(request);
        Optional<String> embarcacionIdOpt = Optional.of(params.get("id"));
        Integer embarcacionId = null;
        if(embarcacionIdOpt.isPresent()){
            embarcacionId = Integer.valueOf(embarcacionIdOpt.get());
        }
        EmbarcacionService embarcacionService = new EmbarcacionServiceImpl();
        embarcacionService.borrar(embarcacionId);
        sendJsonResponse(response, new ActionPayload(200, embarcacionId, "Embarcación eliminada."));
    }

}
