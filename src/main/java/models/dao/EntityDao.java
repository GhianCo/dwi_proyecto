package models.dao;

import java.util.ArrayList;

public interface EntityDao<T> {
    public int create(T entity);
    
    public T find(Object id);
    public ArrayList<T> findAll();
    
    public void update(T entity);
    public void delete(Object id);
}
