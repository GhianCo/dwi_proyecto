package modules.conductor;

import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import modules.conductor.dto.ConductorCreateRequestDTO;
import modules.conductor.models.Conductor;
import modules.conductor.services.impl.ConductorServiceImpl;
import shared.ActionPayload;
import shared.PaginationResult;

@Path("conductor")
public class ConductorResource {

    @GET
    @Path("getAll")
    public Response getAll(
            @DefaultValue("") @QueryParam("query") String query,
            @DefaultValue("1") @QueryParam("page") String page,
            @DefaultValue("10") @QueryParam("perPage") String perPage
    ) {
        ConductorServiceImpl conductorService = new ConductorServiceImpl();
        PaginationResult data = conductorService.paginate(query, Integer.parseInt(page), Integer.parseInt(perPage));

        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data.getData(), "Lista de conductores", data.getPagination()))
                .build();
    }

    @GET
    @Path("{id}")
    public Response getOne(@PathParam("id") String conductorId) {
        ConductorServiceImpl conductorService = new ConductorServiceImpl();
        Conductor conductor = conductorService.buscar(conductorId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, conductor, "Conductor encontrado"))
                .build();
    }

    @POST
    public Response create(ConductorCreateRequestDTO conductorCreateRequestDTO) {
        ConductorServiceImpl conductorService = new ConductorServiceImpl();
        Conductor data = conductorService.createConductorAndPersona(conductorCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(201, data, "Conductor creado exitosamente"))
                .build();
    }

    @PUT
    @Path("{id}")
    public Response update(@PathParam("id") int conductorId, ConductorCreateRequestDTO conductorCreateRequestDTO) {
        ConductorServiceImpl conductorService = new ConductorServiceImpl();
        conductorCreateRequestDTO.setId(conductorId);
        Conductor data = conductorService.updateConductorAndPersona(conductorCreateRequestDTO);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, data, "Conductor actualizado exitosamente"))
                .build();
    }
    
    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") int conductorId) {
        ConductorServiceImpl conductorService = new ConductorServiceImpl();
        conductorService.borrar(conductorId);
        return Response
                .status(Response.Status.OK)
                .entity(new ActionPayload(200, conductorId, "Conductor eliminado exitosamente"))
                .build();
    }
}


