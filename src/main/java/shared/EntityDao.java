package shared;

import java.util.List;

public interface EntityDao<T> {
    public int create(T entity);
    
    public T find(Object id);
    public List<T> findAll();
    
    public PaginationResult paginate(String query, int page, int perPage);

    public void update(T entity);
    public void delete(Object id);
}
