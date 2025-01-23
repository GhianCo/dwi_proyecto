package services;

import java.util.ArrayList;

public interface BaseService<T> {

    public void crear(T entity);

    public T buscar(Object id);

    public ArrayList<T> listar();

    public void update(T entity);

    public void borrar(Object id);
}
