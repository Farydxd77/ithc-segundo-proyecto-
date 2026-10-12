package com.ithc.voluntarioserca.anuncios;

// Error de negocio con el código HTTP que debe devolver el controller
public class AnuncioException extends RuntimeException {

    private final int status;

    public AnuncioException(int status, String message) {
        super(message);
        this.status = status;
    }

    public int getStatus() { return status; }
}
