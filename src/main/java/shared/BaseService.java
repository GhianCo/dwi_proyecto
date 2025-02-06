package shared;

import java.util.List;

public interface BaseService<T> {

    public void crear(T entity);

    public T buscar(Object id);

    public List<T> listar();
    
    public PaginationResult paginate(String query, int page, int perPage);

    public void update(T entity);

    public void borrar(Object id);
}
