package modules.conductor.servlets;

import http.JsonRequestWrapper;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.conductor.dto.ConductorCreateRequestDTO;
import modules.conductor.models.Conductor;
import modules.conductor.services.impl.ConductorServiceImpl;
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

        ConductorCreateRequestDTO conductorCreateRequestDTO = JsonMapper.mapJsonToDto(jsonRequest, ConductorCreateRequestDTO.class);

        ConductorServiceImpl conductorservice = new ConductorServiceImpl();
        Conductor data = conductorservice.updateConductorAndPersona(conductorCreateRequestDTO);
        sendJsonResponse(response, new ActionPayload(200, data, "Conductor actualizado exitosamente"));
    }

}
