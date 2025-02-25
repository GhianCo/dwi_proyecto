package modules.embarcacion;

import modules.embarcacion.models.Embarcacion;
import modules.embarcacion.services.EmbarcacionService;
import modules.embarcacion.services.impl.EmbarcacionServiceImpl;
import shared.ActionPayload;
import shared.PaginationResult;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("embarcacion")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EmbarcacionResource {

    private static final Logger logger = LoggerFactory.getLogger(EmbarcacionResource.class);
    private final EmbarcacionService embarcacionService = new EmbarcacionServiceImpl();

    @GET
    @Path("getAll")
    public Response getAll(
            @DefaultValue("") @QueryParam("query") String query,
            @DefaultValue("1") @QueryParam("page") String page,
            @DefaultValue("10") @QueryParam("perPage") String perPage
    ) {
        int pageNum, perPageNum;
        try {
            pageNum = Integer.parseInt(page);
            perPageNum = Integer.parseInt(perPage);
        } catch (NumberFormatException e) {
            logger.error("Parámetros de paginación inválidos: page={} perPage={}", page, perPage);
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ActionPayload(400, null, "Parámetros de paginación inválidos"))
                    .build();
        }

        PaginationResult data = embarcacionService.paginate(query, pageNum, perPageNum);
        return Response.ok(new ActionPayload(200, data.getData(), "Lista de embarcaciones", data.getPagination()))
                .build();
    }

    @GET
    @Path("{id}")
    public Response getOne(@PathParam("id") Integer embarcacionId) {
        logger.info("Buscando embarcación con id {}", embarcacionId);
        Embarcacion embarcacion = embarcacionService.buscar(embarcacionId);
        if (embarcacion == null) {
            logger.warn("Embarcación no encontrada con id {}", embarcacionId);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ActionPayload(404, null, "Embarcación no encontrada"))
                    .build();
        }
        return Response.ok(new ActionPayload(200, embarcacion, "Embarcación encontrada")).build();
    }

    @POST
    public Response create(Embarcacion embarcacion) {
        try {
            embarcacionService.crear(embarcacion);
            return Response.status(Response.Status.CREATED)
                    .entity(new ActionPayload(201, embarcacion, "Embarcación creada exitosamente"))
                    .build();
        } catch (Exception e) {
            logger.error("Error al crear la embarcación", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ActionPayload(500, null, "Error al crear la embarcación"))
                    .build();
        }
    }

    @PUT
    @Path("{id}")
    public Response update(@PathParam("id") Integer embarcacionId, Embarcacion embarcacion) {
        logger.info("Actualizando embarcación con id {}", embarcacionId);
        embarcacion.setId(embarcacionId);
        try {
            embarcacionService.update(embarcacion);
            return Response.ok(new ActionPayload(200, embarcacion, "Embarcación actualizada exitosamente"))
                    .build();
        } catch (Exception e) {
            logger.error("Error al actualizar la embarcación", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ActionPayload(500, null, "Error al actualizar la embarcación"))
                    .build();
        }
    }

    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") Integer embarcacionId) {
        logger.info("Eliminando embarcación con id {}", embarcacionId);
        try {
            embarcacionService.borrar(embarcacionId);
            return Response.ok(new ActionPayload(200, embarcacionId, "Embarcación eliminada exitosamente"))
                    .build();
        } catch (Exception e) {
            logger.error("Error al eliminar la embarcación", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ActionPayload(500, null, "Error al eliminar la embarcación"))
                    .build();
        }
    }
}
