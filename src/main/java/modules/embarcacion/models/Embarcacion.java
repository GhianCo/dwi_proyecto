/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modules.embarcacion.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author Geancarlo Supo
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Embarcacion {
    
    private Integer id;
    private Integer personaId;
    private String nombre;
    private String matricula;
    private Double capacidadBodega;
    private String permisoPesca;
    private String regimen;
    private String activa;
    
    
}
