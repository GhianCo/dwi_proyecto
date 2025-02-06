package modules.especie.dto;

public class EspecieCreateRequestDTO {

    private int id;
    private String nombre_comun;
    private String nombre_cientifico;
    private String familia;
    private String abreviatura;
    private double talla_minima;
    private String activa;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre_comun() {
        return nombre_comun;
    }

    public void setNombre_comun(String nombre_comun) {
        this.nombre_comun = nombre_comun;
    }

    public String getNombre_cientifico() {
        return nombre_cientifico;
    }

    public void setNombre_cientifico(String nombre_cientifico) {
        this.nombre_cientifico = nombre_cientifico;
    }

    public String getFamilia() {
        return familia;
    }

    public void setFamilia(String familia) {
        this.familia = familia;
    }

    public String getAbreviatura() {
        return abreviatura;
    }

    public void setAbreviatura(String abreviatura) {
        this.abreviatura = abreviatura;
    }

    public double getTalla_minima() {
        return talla_minima;
    }

    public void setTalla_minima(double tall_minima) {
        this.talla_minima = tall_minima;
    }

    public String getActivo() {
        return activa;
    }

    public void setActivo(String activa) {
        this.activa = activa;
    }
}
