/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package modules.puntodesembarque.models;

/**
 *
 * @author Geancarlo Supo
 */
public class PuntoDesembarque {
    private Integer id;
    private String nombre;
    private String tipo;
    private String ubigeo;

    public PuntoDesembarque() {
    }

    public PuntoDesembarque(Integer id, String nombre, String tipo, String ubigeo) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.ubigeo = ubigeo;
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public String getUbigeo() {
        return ubigeo;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setUbigeo(String ubigeo) {
        this.ubigeo = ubigeo;
    }
    
    
    
}
