package shared;

public class Persona {

    private int id;
    private String nombres;
    private String apellidos;
    private String numero_documento;
    private String tipo_documento;
    private String es_juridica;
    private String telefono;
    private String email;
    private String direccion;
    private String activa;

    public Persona() {
    }

    public Persona(int id, String nombres, String apellidos, String tipo_documento, String numero_documento, String direccion, String telefono, String email) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.direccion = direccion;
        this.tipo_documento = tipo_documento;
        this.numero_documento = numero_documento;
        this.telefono = telefono;
        this.email = email;
    }

    public Persona(int id, String nombres, String apellidos, String dni) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
    }

    public Persona(String nombres, String apellidos, String tipo_documento, String numero_documento, String direccion, String telefono, String email) {
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.direccion = direccion;
        this.tipo_documento = tipo_documento;
        this.numero_documento = numero_documento;
        this.telefono = telefono;
        this.email = email;
    }

    public Persona(String nombres, String apellidos, String numero_documento) {
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.numero_documento = numero_documento;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getNumero_documento() {
        return numero_documento;
    }

    public void setNumero_documento(String numero_documento) {
        this.numero_documento = numero_documento;
    }

    public String getTipo_documento() {
        return tipo_documento;
    }

    public void setTipo_documento(String tipo_documento) {
        this.tipo_documento = tipo_documento;
    }

    public String getEs_juridica() {
        return es_juridica;
    }

    public void setEs_juridica(String es_juridica) {
        this.es_juridica = es_juridica;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getActiva() {
        return activa;
    }

    public void setActiva(String activa) {
        this.activa = activa;
    }

}
