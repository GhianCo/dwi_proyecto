package modules.puntodesembarque;

import shared.ActionPayload;
import shared.PaginationResult;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import modules.puntodesembarque.models.PuntoDesembarque;
import modules.puntodesembarque.services.PuntoDesembarqueService;
import modules.puntodesembarque.services.impl.PuntoDesembarqueServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("punto-desembarque")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PuntoDesembarqueResource {

    private static final Logger logger = LoggerFactory.getLogger(PuntoDesembarqueResource.class);
    private final PuntoDesembarqueService puntoDesembarqueService = new PuntoDesembarqueServiceImpl();

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

        PaginationResult data = puntoDesembarqueService.paginate(query, pageNum, perPageNum);
        return Response.ok(new ActionPayload(200, data.getData(), "Lista de puntos de desembarquues", data.getPagination()))
                .build();
    }

    @GET
    @Path("{id}")
    public Response getOne(@PathParam("id") Integer puntoDesembarqueId) {
        logger.info("Buscando punto de desembarque con id {}", puntoDesembarqueId);
        PuntoDesembarque puntoDesembarque = puntoDesembarqueService.buscar(puntoDesembarqueId);
        if (puntoDesembarque == null) {
            logger.warn("Punto de Desembarque no encontrado con id {}", puntoDesembarqueId);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new ActionPayload(404, null, "Punto de Desembarque no encontrado"))
                    .build();
        }
        return Response.ok(new ActionPayload(200, puntoDesembarque, "Punto de Desembarque encontrado")).build();
    }

    @POST
    public Response create(PuntoDesembarque puntoDesembarque) {
        try {
            puntoDesembarqueService.crear(puntoDesembarque);
            return Response.status(Response.Status.CREATED)
                    .entity(new ActionPayload(201, puntoDesembarque, "Punto de Desembarque creado exitosamente"))
                    .build();
        } catch (Exception e) {
            logger.error("Error al crear el punto de desembarque", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ActionPayload(500, null, "Error al crear el punto de desembarque"))
                    .build();
        }
    }

    @POST
    @Path("{id}")
    public Response update(@PathParam("id") Integer puntoDesembarqueId, PuntoDesembarque puntoDesembarque) {
        logger.info("Actualizando punto de desembarque con id {}", puntoDesembarqueId);
        puntoDesembarque.setId(puntoDesembarqueId);
        try {
            puntoDesembarqueService.update(puntoDesembarque);
            return Response.ok(new ActionPayload(200, puntoDesembarque, "Punto de Desembarque actualizado exitosamente"))
                    .build();
        } catch (Exception e) {
            logger.error("Error al actualizar el punto de desembarque", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ActionPayload(500, null, "Error al actualizar el punto de desembarque"))
                    .build();
        }
    }

    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") Integer puntoDesembarqueId) {
        logger.info("Eliminando punto de desembarque con id {}", puntoDesembarqueId);
        try {
            puntoDesembarqueService.borrar(puntoDesembarqueId);
            return Response.ok(new ActionPayload(200, puntoDesembarqueId, "Punto de Desembarque eliminado exitosamente"))
                    .build();
        } catch (Exception e) {
            logger.error("Error al eliminar el punto de desembarque", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ActionPayload(500, null, "Error al eliminar el punto de desembarque"))
                    .build();
        }
    }
}
