package modules.conductor.servlets;

import java.io.IOException;

import org.json.JSONObject;

import http.JsonRequestWrapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.conductor.dto.ConductorCreateRequestDTO;
import modules.conductor.models.Conductor;
import modules.conductor.services.impl.ConductorServiceImpl;
import shared.ActionPayload;
import shared.BaseServlet;
import shared.JsonMapper;

public class Create extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        JsonRequestWrapper wrappedRequest = (JsonRequestWrapper) request;
        String jsonBody = wrappedRequest.getJsonBody();

        JSONObject jsonRequest = new JSONObject(jsonBody);

        ConductorCreateRequestDTO conductorCreateRequestDTO = JsonMapper.mapJsonToDto(jsonRequest, ConductorCreateRequestDTO.class);
        
        ConductorServiceImpl conductorservice = new ConductorServiceImpl();
        Conductor data = conductorservice.createConductorAndPersona(conductorCreateRequestDTO);
        sendJsonResponse(response, new ActionPayload(201, data, "Conductor creado exitosamente"));

    }

}