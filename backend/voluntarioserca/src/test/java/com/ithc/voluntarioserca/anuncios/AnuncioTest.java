package com.ithc.voluntarioserca.anuncios;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.ithc.voluntarioserca.auth.User;

class AnuncioTest {

    private Anuncio nuevoAnuncio(int cupos) {
        Anuncio anuncio = new Anuncio();
        anuncio.setCupos(cupos);
        return anuncio;
    }

    @Test
    void unaConvocatoriaAbiertaAceptaInscripciones() {
        Anuncio anuncio = nuevoAnuncio(5);
        User voluntario = new User();

        anuncio.inscribir(voluntario);

        assertTrue(anuncio.estaInscrito(voluntario));
    }

    @Test
    void unaConvocatoriaCerradaNoAceptaInscripciones() {
        Anuncio anuncio = nuevoAnuncio(5);
        anuncio.cerrar();

        IllegalStateException e = assertThrows(IllegalStateException.class, () -> anuncio.inscribir(new User()));

        assertEquals("La convocatoria está cerrada y ya no acepta inscripciones", e.getMessage());
        assertEquals(0, anuncio.getVoluntarios().size());
    }

    @Test
    void noSePuedeCerrarDosVeces() {
        Anuncio anuncio = nuevoAnuncio(5);
        anuncio.cerrar();

        assertThrows(IllegalStateException.class, anuncio::cerrar);
    }
}
