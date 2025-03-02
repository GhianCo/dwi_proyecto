package modules.destino.models;

public class Destino {

    private int id;
    private String nombre;
    private String tipo;
    private String actividad;
    private String direccion;
    private String activa;

    public Destino() {
    }

    public Destino(int id, String nombre, String tipo, String actividad, String direccion, String activa) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.actividad = actividad;
        this.direccion = direccion;
        this.activa = activa;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getActividad() {
        return actividad;
    }

    public void setActividad(String actividad) {
        this.actividad = actividad;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getActiva() {
        return activa;
    }

    public void setActiva(String activa) {
        this.activa = activa;
    }

}
