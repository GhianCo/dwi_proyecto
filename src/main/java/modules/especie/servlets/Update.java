package modules.especie.servlets;

import http.JsonRequestWrapper;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.especie.dto.EspecieCreateRequestDTO;
import modules.especie.models.Especie;
import modules.especie.services.impl.EspecieServiceImpl;
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

        EspecieCreateRequestDTO especieCreateRequestDTO = JsonMapper.mapJsonToDto(jsonRequest, EspecieCreateRequestDTO.class);

        EspecieServiceImpl especieService = new EspecieServiceImpl();
        Especie data = especieService.updateEspecie(especieCreateRequestDTO);
        sendJsonResponse(response, new ActionPayload(200, data, "Especie actualizada exitosamente"));
    }

}
