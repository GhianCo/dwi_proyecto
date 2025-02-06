package modules.embarcacion.servlets;

import http.JsonRequestWrapper;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.conductor.dto.ConductorCreateRequestDTO;
import modules.conductor.models.Conductor;
import modules.conductor.services.impl.ConductorServiceImpl;
import modules.embarcacion.models.Embarcacion;
import modules.embarcacion.services.EmbarcacionService;
import modules.embarcacion.services.impl.EmbarcacionServiceImpl;
import org.json.JSONObject;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.JsonMapper;

public class Update extends BaseServlet {

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        JsonRequestWrapper wrappedRequest = (JsonRequestWrapper) request;
        String jsonBody = wrappedRequest.getJsonBody();

        JSONObject jsonRequest = new JSONObject(jsonBody);

        Embarcacion embarcacion = JsonMapper.mapJsonToDto(jsonRequest, Embarcacion.class);
        
        EmbarcacionService embarcacionService = new EmbarcacionServiceImpl();
        embarcacionService.update(embarcacion);
        sendJsonResponse(response, new ActionPayload(200, embarcacion, "Embarcación actualizada exitosamente"));
    }

}
