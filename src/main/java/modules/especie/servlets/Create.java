package modules.especie.servlets;

import java.io.IOException;

import org.json.JSONObject;

import http.JsonRequestWrapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.especie.dto.EspecieCreateRequestDTO;
import modules.especie.models.Especie;
import modules.especie.services.impl.EspecieServiceImpl;
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

        EspecieCreateRequestDTO especieCreateRequestDTO = JsonMapper.mapJsonToDto(jsonRequest, EspecieCreateRequestDTO.class);
        
        EspecieServiceImpl especieService = new EspecieServiceImpl();
        Especie data = especieService.createEspecie(especieCreateRequestDTO);
        sendJsonResponse(response, new ActionPayload(201, data, "Especie creada exitosamente"));
    }
}
