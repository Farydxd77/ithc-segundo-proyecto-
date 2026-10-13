package com.ithc.voluntarioserca.anuncios;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.domain.Specification;

import com.ithc.voluntarioserca.auth.User;

import jakarta.persistence.criteria.Predicate;

// Búsqueda y filtros de convocatorias: cada campo vacío se omite y los demás se combinan con AND
public record AnuncioFiltro(String q, Anuncio.Causa causa, Anuncio.Modalidad modalidad, String lugar,
        String desde, String hasta, boolean disponibles) {

    public Specification<Anuncio> toSpecification() {
        return (root, query, cb) -> {
            List<Predicate> condiciones = new ArrayList<>();
            if (tieneTexto(q)) {
                String patron = contiene(q);
                condiciones.add(cb.or(
                        cb.like(cb.lower(root.get("titulo")), patron),
                        cb.like(cb.lower(root.get("organizacion")), patron)));
            }
            if (causa != null) {
                condiciones.add(cb.equal(root.get("causa"), causa));
            }
            if (modalidad != null) {
                condiciones.add(cb.equal(root.get("modalidad"), modalidad));
            }
            if (tieneTexto(lugar)) {
                condiciones.add(cb.like(cb.lower(root.get("lugar")), contiene(lugar)));
            }
            // La fecha se guarda como YYYY-MM-DD, así que el orden de texto coincide con el de fechas
            if (tieneTexto(desde)) {
                condiciones.add(cb.greaterThanOrEqualTo(root.get("fecha"), desde.trim()));
            }
            if (tieneTexto(hasta)) {
                condiciones.add(cb.lessThanOrEqualTo(root.get("fecha"), hasta.trim()));
            }
            // Disponibles: abiertas y con al menos un cupo libre
            if (disponibles) {
                condiciones.add(cb.equal(root.get("estado"), Anuncio.Estado.abierta));
                condiciones.add(cb.lessThan(cb.size(root.<Set<User>>get("voluntarios")), root.<Integer>get("cupos")));
            }
            return cb.and(condiciones.toArray(new Predicate[0]));
        };
    }

    private static boolean tieneTexto(String valor) {
        return valor != null && !valor.isBlank();
    }

    private static String contiene(String valor) {
        return "%" + valor.trim().toLowerCase() + "%";
    }
}
