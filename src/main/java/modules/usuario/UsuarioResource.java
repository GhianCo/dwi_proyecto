package modules.usuario;

import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import modules.usuario.dto.UsuarioCreateRequestDTO;
import modules.usuario.models.Usuario;
import modules.usuario.services.impl.UsuarioServiceImpl;
import shared.ActionPayload;
import shared.PaginationResult;

@Path("usuario")
public class UsuarioResource {

    @GET
    @Path("getAll")
    public Response getAll(
            @DefaultValue("") @QueryParam("query") String query,
            @DefaultValue("1") @QueryParam("page") String page,
            @DefaultValue("10") @QueryParam("perPage") String perPage
    ) {
        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        PaginationResult data = usuarioservice.paginate(query, Integer.parseInt(page), Integer.parseInt(perPage));

        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data.getData(), "Lista de usuarios", data.getPagination()))
                .build();
    }

    @GET
    @Path("{id}")
    public Response getOne(@PathParam("id") String usuarioId) {
        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        Usuario usuario = usuarioservice.buscar(usuarioId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, usuario, "Usuario encontrado"))
                .build();
    }

    @POST
    public Response create(UsuarioCreateRequestDTO usuarioCreateRequestDTO) {
        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        Usuario data = usuarioservice.createUsuarioAndPersona(usuarioCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(201, data, "Usuario creado exitosamente"))
                .build();
    }

    @POST
    @Path("{id}")
    public Response update(@PathParam("id") int usuarioId, UsuarioCreateRequestDTO usuarioCreateRequestDTO) {
        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        usuarioCreateRequestDTO.setId(usuarioId);
        Usuario data = usuarioservice.updateUsuarioAndPersona(usuarioCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data, "Usuario actualizado exitosamente"))
                .build();
    }
    
    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") int usuarioId) {
        UsuarioServiceImpl usuarioservice = new UsuarioServiceImpl();
        usuarioservice.borrar(usuarioId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, usuarioId, "Usuario eliminado exitosamente"))
                .build();
    }
}
