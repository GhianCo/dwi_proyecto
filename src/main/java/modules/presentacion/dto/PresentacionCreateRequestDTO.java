package modules.presentacion.dto;

public class PresentacionCreateRequestDTO {

    private int id;
    private String nombre;
    private double peso_promedio;
    private String activa;

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

    public double getPeso_promedio() {
        return peso_promedio;
    }

    public void setPeso_promedio(double peso_promedio) {
        this.peso_promedio = peso_promedio;
    }

    public String getActiva() {
        return activa;
    }

    public void setActiva(String activa) {
        this.activa = activa;
    }

}
