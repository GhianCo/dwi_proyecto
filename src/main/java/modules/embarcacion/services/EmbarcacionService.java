/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modules.embarcacion.services;

import java.util.ArrayList;
import modules.embarcacion.dto.EmbarcacionGetAllDto;
import modules.embarcacion.models.Embarcacion;
import shared.BaseService;
import shared.PaginationResult;

/**
 *
 * @author Geancarlo Supo
 */
public interface EmbarcacionService extends BaseService<Embarcacion>  {

    public ArrayList<EmbarcacionGetAllDto> listarCompleto();
     public PaginationResult paginateWithAdditional(String query, int page, int perPage);
    
}
