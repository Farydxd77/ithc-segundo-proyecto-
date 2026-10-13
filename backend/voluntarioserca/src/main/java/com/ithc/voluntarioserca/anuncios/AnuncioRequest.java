package com.ithc.voluntarioserca.anuncios;

public record AnuncioRequest(String titulo, String organizacion, String descripcion, String fecha, String lugar,
        Integer cupos, Anuncio.Causa causa, Anuncio.Modalidad modalidad) {}
