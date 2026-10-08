package com.ithc.voluntarioserca.anuncios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {

    List<Anuncio> findAllByOrderByIdDesc();
}
