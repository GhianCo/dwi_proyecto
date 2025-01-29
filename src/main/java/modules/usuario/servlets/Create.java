package modules.usuario.servlets;

import http.JsonRequestWrapper;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modules.usuario.dto.UsuarioCreateRequestDTO;
import modules.usuario.services.impl.UsuarioServiceImpl;
import modules.usuario.models.Usuario;
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

        UsuarioCreateRequestDTO usuarioCreateRequestDTO = JsonMapper.mapJsonToDto(jsonRequest, UsuarioCreateRequestDTO.class);
        
        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        Usuario data = usuarioservice.createUsuarioAndPersona(usuarioCreateRequestDTO);
        sendJsonResponse(response, new ActionPayload(201, data, "Usuario creado exitosamente"));

    }

}
