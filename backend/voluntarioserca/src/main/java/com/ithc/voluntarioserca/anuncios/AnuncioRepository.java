package com.ithc.voluntarioserca.anuncios;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long>, JpaSpecificationExecutor<Anuncio> {

    // Bloquea la fila (SELECT ... FOR UPDATE) hasta que termine la transacción,
    // así dos inscripciones simultáneas no pueden pasarse del cupo
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Anuncio a where a.id = :id")
    Optional<Anuncio> findByIdForUpdate(@Param("id") Long id);
}
