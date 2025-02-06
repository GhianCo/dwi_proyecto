package modules.embarcacion.dto;

import lombok.Data;

/**
 *
 * @author Geancarlo Supo
 */
@Data
public class EmbarcacionCreateRequestDTO {

    private Integer id;
    private Integer personaId;
    private String nombre;
    private String matricula;
    private Double capacidadBodega;
    private String permisoPesca;
    private String regimen;
    private Character activa;

}
