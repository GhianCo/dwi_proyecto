package modules.embarcacion.models;

public class Embarcacion {

    private int id;
    private int persona_id;
    private String nombre;
    private String matricula;
    private double capacidad_bodega;
    private String permiso_pesca;
    private String regimen;
    private String activa;

    public Embarcacion() {
    }

    public Embarcacion(int id, int persona_id, String nombre, String matricula, double capacidad_bodega, String permiso_pesca, String regimen, String activa) {
        this.id = id;
        this.persona_id = persona_id;
        this.nombre = nombre;
        this.matricula = matricula;
        this.capacidad_bodega = capacidad_bodega;
        this.permiso_pesca = permiso_pesca;
        this.regimen = regimen;
        this.activa = activa;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPersona_id() {
        return persona_id;
    }

    public void setPersona_id(int persona_id) {
        this.persona_id = persona_id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public double getCapacidad_bodega() {
        return capacidad_bodega;
    }

    public void setCapacidad_bodega(double capacidad_bodega) {
        this.capacidad_bodega = capacidad_bodega;
    }

    public String getPermiso_pesca() {
        return permiso_pesca;
    }

    public void setPermiso_pesca(String permiso_pesca) {
        this.permiso_pesca = permiso_pesca;
    }

    public String getRegimen() {
        return regimen;
    }

    public void setRegimen(String regimen) {
        this.regimen = regimen;
    }

    public String getActiva() {
        return activa;
    }

    public void setActiva(String activa) {
        this.activa = activa;
    }

}
