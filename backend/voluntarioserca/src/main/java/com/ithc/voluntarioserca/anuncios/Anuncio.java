package com.ithc.voluntarioserca.anuncios;

import java.util.HashSet;
import java.util.Set;

import com.ithc.voluntarioserca.auth.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "anuncios")
public class Anuncio {

    public enum Estado { abierta, cerrada }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String organizacion;

    @Column(nullable = false, length = 2000)
    private String descripcion;

    @Column(nullable = false)
    private String fecha;

    @Column(nullable = false)
    private String lugar;

    @Column(nullable = false)
    private int cupos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado = Estado.abierta;

    @ManyToOne(optional = false)
    private User creador;

    @ManyToMany
    @JoinTable(name = "inscripciones")
    private Set<User> voluntarios = new HashSet<>();

    // Regla de estado: solo se puede cerrar una convocatoria abierta
    public void cerrar() {
        if (estado == Estado.cerrada) {
            throw new IllegalStateException("La convocatoria ya está cerrada");
        }
        estado = Estado.cerrada;
    }

    // Restricción principal: una convocatoria cerrada no acepta inscripciones
    public void inscribir(User voluntario) {
        if (estado == Estado.cerrada) {
            throw new IllegalStateException("La convocatoria está cerrada y ya no acepta inscripciones");
        }
        if (voluntarios.contains(voluntario)) {
            throw new IllegalStateException("Ya estás inscrito en esta convocatoria");
        }
        if (voluntarios.size() >= cupos) {
            throw new IllegalStateException("No quedan cupos disponibles");
        }
        voluntarios.add(voluntario);
    }

    public boolean estaInscrito(User user) { return voluntarios.contains(user); }

    public Long getId() { return id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getOrganizacion() { return organizacion; }
    public void setOrganizacion(String organizacion) { this.organizacion = organizacion; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getLugar() { return lugar; }
    public void setLugar(String lugar) { this.lugar = lugar; }

    public int getCupos() { return cupos; }
    public void setCupos(int cupos) { this.cupos = cupos; }

    public Estado getEstado() { return estado; }

    public User getCreador() { return creador; }
    public void setCreador(User creador) { this.creador = creador; }

    public Set<User> getVoluntarios() { return voluntarios; }
}
