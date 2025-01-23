package models.entities;

public class Usuario extends Persona{

    private int id;
    private int persona_id;
    private double sueldo;
    private String rol;
    private String nick;
    private String clave;
    private String activo;

    public Usuario() {
    }

    public Usuario(int id, int persona_id, double sueldo, String rol, String nick, String clave, String activo) {
        this.id = id;
        this.persona_id = persona_id;
        this.sueldo = sueldo;
        this.rol = rol;
        this.nick = nick;
        this.clave = clave;
        this.activo = activo;
    }
    
    public Usuario(int id, int persona_id, String nombres, String apellidos, String dni) {
        super(nombres, apellidos, dni);
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

    public double getSueldo() {
        return sueldo;
    }

    public void setSueldo(double sueldo) {
        this.sueldo = sueldo;
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
