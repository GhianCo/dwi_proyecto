package modules.conductor.models;

import shared.Persona;

public class Conductor extends Persona {

    private int id;
    private int persona_id;
    private String fecha_nacimiento;
    private String activo;

    public Conductor() {
    }

    public Conductor(int id, int persona_id, String fecha_nacimiento, String activo) {
        this.id = id;
        this.persona_id = persona_id;
        this.fecha_nacimiento = fecha_nacimiento;
        this.activo = activo;
    }

    public Conductor(int id, int persona_id, String nombres, String apellidos, String numero_documento) {
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

    public String getFecha_nacimiento() {
        return fecha_nacimiento;
    }

    public void setFecha_nacimiento(String fecha_nacimiento) {
        this.fecha_nacimiento = fecha_nacimiento;
    }

    public String getActivo() {
        return activo;
    }

    public void setActivo(String activo) {
        this.activo = activo;
    }

}
