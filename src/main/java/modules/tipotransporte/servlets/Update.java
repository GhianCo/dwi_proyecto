package modules.tipotransporte.servlets;

import modules.tipotransporte.servlets.*;
import http.JsonRequestWrapper;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.tipotransporte.dto.TipoTransporteCreateRequestDTO;
import modules.tipotransporte.models.TipoTransporte;
import modules.tipotransporte.services.impl.TipoTransporteServiceImpl;
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

        TipoTransporteCreateRequestDTO tipotransporteCreateRequestDTO = JsonMapper.mapJsonToDto(jsonRequest, TipoTransporteCreateRequestDTO.class);

        TipoTransporteServiceImpl tipotransporteservice = new TipoTransporteServiceImpl();
        TipoTransporte data = tipotransporteservice.updateTipoTransporteAndPersona(tipotransporteCreateRequestDTO);
        sendJsonResponse(response, new ActionPayload(200, data, "Tipo de transporte actualizado exitosamente"));
    }

}
