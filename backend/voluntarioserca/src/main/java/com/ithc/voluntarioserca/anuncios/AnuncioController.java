package com.ithc.voluntarioserca.anuncios;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ithc.voluntarioserca.auth.User;
import com.ithc.voluntarioserca.auth.UserRepository;

@RestController
@RequestMapping("/api/anuncios")
@CrossOrigin(origins = "http://localhost:5173")
@Transactional
public class AnuncioController {

    record AnuncioRequest(String titulo, String organizacion, String descripcion, String fecha, String lugar, Integer cupos) {}
    record AnuncioResponse(Long id, String titulo, String organizacion, String descripcion, String fecha, String lugar,
            int cupos, String estado, Long creadorId, String creadorNombre, int inscritos, boolean inscrito) {}

    private final AnuncioRepository anuncioRepository;
    private final UserRepository userRepository;

    public AnuncioController(AnuncioRepository anuncioRepository, UserRepository userRepository) {
        this.anuncioRepository = anuncioRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> listar(@RequestHeader(value = "Authorization", required = false) String header) {
        Optional<User> user = findByHeader(header);
        if (user.isEmpty()) {
            return error(401, "Sesión inválida");
        }
        List<AnuncioResponse> anuncios = anuncioRepository.findAllByOrderByIdDesc().stream()
                .map(a -> toResponse(a, user.get()))
                .toList();
        return ResponseEntity.ok(anuncios);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestHeader(value = "Authorization", required = false) String header,
            @RequestBody AnuncioRequest req) {
        Optional<User> user = findByHeader(header);
        if (user.isEmpty()) {
            return error(401, "Sesión inválida");
        }
        String invalido = validar(req);
        if (invalido != null) {
            return error(400, invalido);
        }

        Anuncio anuncio = new Anuncio();
        anuncio.setCreador(user.get());
        copiarDatos(req, anuncio);
        anuncioRepository.save(anuncio);

        return ResponseEntity.ok(toResponse(anuncio, user.get()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@RequestHeader(value = "Authorization", required = false) String header,
            @PathVariable Long id, @RequestBody AnuncioRequest req) {
        Optional<User> user = findByHeader(header);
        if (user.isEmpty()) {
            return error(401, "Sesión inválida");
        }
        Optional<Anuncio> found = anuncioRepository.findById(id);
        if (found.isEmpty()) {
            return error(404, "El anuncio no existe");
        }
        Anuncio anuncio = found.get();
        if (!esCreador(anuncio, user.get())) {
            return error(403, "Solo quien creó el anuncio puede editarlo");
        }
        String invalido = validar(req);
        if (invalido != null) {
            return error(400, invalido);
        }
        if (req.cupos() < anuncio.getVoluntarios().size()) {
            return error(400, "Los cupos no pueden ser menos que los voluntarios ya inscritos");
        }

        copiarDatos(req, anuncio);
        return ResponseEntity.ok(toResponse(anuncio, user.get()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@RequestHeader(value = "Authorization", required = false) String header,
            @PathVariable Long id) {
        Optional<User> user = findByHeader(header);
        if (user.isEmpty()) {
            return error(401, "Sesión inválida");
        }
        Optional<Anuncio> found = anuncioRepository.findById(id);
        if (found.isEmpty()) {
            return error(404, "El anuncio no existe");
        }
        if (!esCreador(found.get(), user.get())) {
            return error(403, "Solo quien creó el anuncio puede eliminarlo");
        }

        anuncioRepository.delete(found.get());
        return ResponseEntity.ok(Map.of("message", "Anuncio eliminado"));
    }

    @PostMapping("/{id}/cerrar")
    public ResponseEntity<?> cerrar(@RequestHeader(value = "Authorization", required = false) String header,
            @PathVariable Long id) {
        Optional<User> user = findByHeader(header);
        if (user.isEmpty()) {
            return error(401, "Sesión inválida");
        }
        Optional<Anuncio> found = anuncioRepository.findById(id);
        if (found.isEmpty()) {
            return error(404, "El anuncio no existe");
        }
        Anuncio anuncio = found.get();
        if (!esCreador(anuncio, user.get())) {
            return error(403, "Solo quien creó el anuncio puede cerrar la convocatoria");
        }

        try {
            anuncio.cerrar();
        } catch (IllegalStateException e) {
            return error(409, e.getMessage());
        }
        return ResponseEntity.ok(toResponse(anuncio, user.get()));
    }

    @PostMapping("/{id}/inscribirse")
    public ResponseEntity<?> inscribirse(@RequestHeader(value = "Authorization", required = false) String header,
            @PathVariable Long id) {
        Optional<User> user = findByHeader(header);
        if (user.isEmpty()) {
            return error(401, "Sesión inválida");
        }
        Optional<Anuncio> found = anuncioRepository.findById(id);
        if (found.isEmpty()) {
            return error(404, "El anuncio no existe");
        }

        Anuncio anuncio = found.get();
        try {
            anuncio.inscribir(user.get());
        } catch (IllegalStateException e) {
            return error(409, e.getMessage());
        }
        return ResponseEntity.ok(toResponse(anuncio, user.get()));
    }

    private void copiarDatos(AnuncioRequest req, Anuncio anuncio) {
        anuncio.setTitulo(req.titulo().trim());
        anuncio.setOrganizacion(req.organizacion().trim());
        anuncio.setDescripcion(req.descripcion().trim());
        anuncio.setFecha(req.fecha().trim());
        anuncio.setLugar(req.lugar().trim());
        anuncio.setCupos(req.cupos());
    }

    private String validar(AnuncioRequest req) {
        if (isEmpty(req.titulo()) || isEmpty(req.organizacion()) || isEmpty(req.descripcion())
                || isEmpty(req.fecha()) || isEmpty(req.lugar()) || req.cupos() == null) {
            return "Completa todos los campos";
        }
        if (req.cupos() < 1) {
            return "Debe haber al menos 1 cupo";
        }
        return null;
    }

    private boolean esCreador(Anuncio anuncio, User user) {
        return anuncio.getCreador().getId().equals(user.getId());
    }

    private Optional<User> findByHeader(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            return Optional.empty();
        }
        return userRepository.findByToken(header.substring(7));
    }

    private AnuncioResponse toResponse(Anuncio a, User user) {
        return new AnuncioResponse(a.getId(), a.getTitulo(), a.getOrganizacion(), a.getDescripcion(), a.getFecha(),
                a.getLugar(), a.getCupos(), a.getEstado().name(), a.getCreador().getId(), a.getCreador().getName(),
                a.getVoluntarios().size(), a.estaInscrito(user));
    }

    private boolean isEmpty(String value) {
        return value == null || value.isBlank();
    }

    private ResponseEntity<?> error(int status, String message) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}
