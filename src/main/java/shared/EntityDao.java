package shared;

import java.util.ArrayList;

public interface EntityDao<T> {
    public int create(T entity);
    
    public T find(Object id);
    public ArrayList<T> findAll();
    
    public PaginationResult paginate(String query, int page, int perPage);

    public void update(T entity);
    public void delete(Object id);
}
