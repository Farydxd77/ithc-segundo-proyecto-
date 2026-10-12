package com.ithc.voluntarioserca.anuncios;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
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
@CrossOrigin(originPatterns = "${app.frontend-url}")
public class AnuncioController {

    record Postulado(Long id, String nombre) {}
    record AnuncioResponse(Long id, String titulo, String organizacion, String descripcion, String fecha, String lugar,
            int cupos, String estado, Long creadorId, String creadorNombre, int inscritos, boolean inscrito,
            List<Postulado> postulados) {}

    private final AnuncioService anuncioService;
    private final UserRepository userRepository;

    public AnuncioController(AnuncioService anuncioService, UserRepository userRepository) {
        this.anuncioService = anuncioService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> listar(@RequestHeader(value = "Authorization", required = false) String header) {
        User user = usuarioDeSesion(header);
        List<AnuncioResponse> anuncios = anuncioService.listar().stream()
                .map(a -> toResponse(a, user))
                .toList();
        return ResponseEntity.ok(anuncios);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestHeader(value = "Authorization", required = false) String header,
            @RequestBody AnuncioRequest req) {
        User user = usuarioDeSesion(header);
        return ResponseEntity.ok(toResponse(anuncioService.crear(user, req), user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@RequestHeader(value = "Authorization", required = false) String header,
            @PathVariable Long id, @RequestBody AnuncioRequest req) {
        User user = usuarioDeSesion(header);
        return ResponseEntity.ok(toResponse(anuncioService.editar(user, id, req), user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@RequestHeader(value = "Authorization", required = false) String header,
            @PathVariable Long id) {
        User user = usuarioDeSesion(header);
        anuncioService.eliminar(user, id);
        return ResponseEntity.ok(Map.of("message", "Anuncio eliminado"));
    }

    @PostMapping("/{id}/cerrar")
    public ResponseEntity<?> cerrar(@RequestHeader(value = "Authorization", required = false) String header,
            @PathVariable Long id) {
        User user = usuarioDeSesion(header);
        return ResponseEntity.ok(toResponse(anuncioService.cerrar(user, id), user));
    }

    @PostMapping("/{id}/reabrir")
    public ResponseEntity<?> reabrir(@RequestHeader(value = "Authorization", required = false) String header,
            @PathVariable Long id) {
        User user = usuarioDeSesion(header);
        return ResponseEntity.ok(toResponse(anuncioService.reabrir(user, id), user));
    }

    @PostMapping("/{id}/inscribirse")
    public ResponseEntity<?> inscribirse(@RequestHeader(value = "Authorization", required = false) String header,
            @PathVariable Long id) {
        User user = usuarioDeSesion(header);
        return ResponseEntity.ok(toResponse(anuncioService.inscribirse(user, id), user));
    }

    @ExceptionHandler(AnuncioException.class)
    public ResponseEntity<?> manejarError(AnuncioException e) {
        return ResponseEntity.status(e.getStatus()).body(Map.of("message", e.getMessage()));
    }

    private User usuarioDeSesion(String header) {
        return findByHeader(header).orElseThrow(() -> new AnuncioException(401, "Sesión inválida"));
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
                a.getVoluntarios().size(), anuncioService.estaInscrito(a, user), postulados(a, user));
    }

    // Solo el creador ve quiénes se postularon
    private List<Postulado> postulados(Anuncio a, User user) {
        if (!a.getCreador().getId().equals(user.getId())) {
            return List.of();
        }
        return a.getVoluntarios().stream()
                .map(v -> new Postulado(v.getId(), v.getName()))
                .sorted(Comparator.comparing(Postulado::id))
                .toList();
    }
}
