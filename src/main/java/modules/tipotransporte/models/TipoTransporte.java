package modules.tipotransporte.models;

import shared.Persona;

public class TipoTransporte extends Persona {

    private int id;
    private int persona_id;
    private String tipo;
    private String matricula;
    private String capacidad_carga;
    private String activo;

    public TipoTransporte() {
    }

    public TipoTransporte(int id, int persona_id, String tipo, String matricula, String capacidad_carga, String activo) {
        this.id = id;
        this.persona_id = persona_id;
        this.tipo = tipo;
        this.matricula = matricula;
        this.capacidad_carga = capacidad_carga;
        this.activo = activo;
    }

    public TipoTransporte(int id, int persona_id, String nombres, String apellidos, String numero_documento) {
        super(nombres, apellidos, numero_documento);
        this.id = id;
        this.persona_id = persona_id;
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

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getCapacidad_carga() {
        return capacidad_carga;
    }

    public void setCapacidad_carga(String capacidad_carga) {
        this.capacidad_carga = capacidad_carga;
    }

    public String getActivo() {
        return activo;
    }

    public void setActivo(String activo) {
        this.activo = activo;
    }

}
