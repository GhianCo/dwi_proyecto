package modules.embarcacion.servlets;

import http.JsonRequestWrapper;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.embarcacion.models.Embarcacion;
import modules.embarcacion.services.EmbarcacionService;
import modules.embarcacion.services.impl.EmbarcacionServiceImpl;
import org.json.JSONObject;
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
        System.out.println(jsonRequest);
        Embarcacion embarcacion = JsonMapper.mapJsonToDto(jsonRequest, Embarcacion.class);
        System.out.println("=====================");
        System.out.println(embarcacion);
        EmbarcacionService embarcacionService = new EmbarcacionServiceImpl();
        embarcacionService.crear(embarcacion);
        sendJsonResponse(response, new ActionPayload(201, embarcacion, "Embarcación creada exitosamente."));

    }

}
