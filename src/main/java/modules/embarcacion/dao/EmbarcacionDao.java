/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modules.embarcacion.dao;

import java.util.List;
import modules.embarcacion.dto.EmbarcacionGetAllDto;
import modules.embarcacion.models.Embarcacion;
import shared.EntityDao;
import shared.Pagination;
import shared.PaginationResult;

/**
 *
 * @author Geancarlo Supo
 */
public interface EmbarcacionDao extends EntityDao<Embarcacion> {
    
    public List<EmbarcacionGetAllDto> findAllWithAdditional();
    public PaginationResult<List<EmbarcacionGetAllDto>, Pagination> paginateWithAdditional(String query, int page, int perPage);

}
