package modules.usuario.models;

import shared.Persona;

public class Usuario extends Persona {

    private int id;
    private int persona_id;
    private String rol;
    private String nick;
    private String clave;
    private String activo;

    public Usuario() {
    }

    public Usuario(int id, int persona_id, double sueldo, String rol, String nick, String clave, String activo) {
        this.id = id;
        this.persona_id = persona_id;
        this.rol = rol;
        this.nick = nick;
        this.clave = clave;
        this.activo = activo;
    }

    public Usuario(int id, int persona_id, String nombres, String apellidos, String numero_documento, String rol) {
        super(nombres, apellidos, numero_documento);
        this.id = id;
        this.persona_id = persona_id;
        this.rol = rol;
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

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getActivo() {
        return activo;
    }

    public void setActivo(String activo) {
        this.activo = activo;
    }

}
