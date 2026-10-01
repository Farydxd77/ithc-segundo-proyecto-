package com.ithc.voluntarioserca.auth;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    record RegisterRequest(String name, String email, String password) {}
    record LoginRequest(String email, String password) {}
    record ForgotRequest(String email) {}
    record ResetRequest(String token, String password) {}
    record UserResponse(Long id, String name, String email) {}
    record AuthResponse(String token, UserResponse user) {}

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (isEmpty(req.name()) || isEmpty(req.email()) || isEmpty(req.password())) {
            return error(400, "Todos los campos son obligatorios");
        }
        if (req.password().length() < 6) {
            return error(400, "La contraseña debe tener al menos 6 caracteres");
        }
        String email = req.email().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            return error(409, "El correo ya está registrado");
        }

        User user = new User();
        user.setName(req.name().trim());
        user.setEmail(email);
        user.setPassword(encoder.encode(req.password()));
        user.setToken(UUID.randomUUID().toString());
        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse(user.getToken(), toResponse(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (isEmpty(req.email()) || isEmpty(req.password())) {
            return error(400, "Correo y contraseña son obligatorios");
        }
        Optional<User> found = userRepository.findByEmail(req.email().trim().toLowerCase());
        if (found.isEmpty() || !encoder.matches(req.password(), found.get().getPassword())) {
            return error(401, "Correo o contraseña incorrectos");
        }

        User user = found.get();
        user.setToken(UUID.randomUUID().toString());
        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse(user.getToken(), toResponse(user)));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String header) {
        Optional<User> user = findByHeader(header);
        if (user.isEmpty()) {
            return error(401, "Sesión inválida");
        }
        return ResponseEntity.ok(toResponse(user.get()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String header) {
        findByHeader(header).ifPresent(user -> {
            user.setToken(null);
            userRepository.save(user);
        });
        return ResponseEntity.ok(Map.of("message", "Sesión cerrada"));
    }

    // No se envía un correo real: se devuelve el token para armar el enlace en el frontend
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotRequest req) {
        if (isEmpty(req.email())) {
            return error(400, "El correo es obligatorio");
        }
        Optional<User> found = userRepository.findByEmail(req.email().trim().toLowerCase());
        if (found.isEmpty()) {
            return error(404, "No existe una cuenta con ese correo");
        }

        User user = found.get();
        user.setResetToken(UUID.randomUUID().toString());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("resetToken", user.getResetToken()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetRequest req) {
        if (isEmpty(req.token()) || isEmpty(req.password())) {
            return error(400, "Datos incompletos");
        }
        if (req.password().length() < 6) {
            return error(400, "La contraseña debe tener al menos 6 caracteres");
        }
        Optional<User> found = userRepository.findByResetToken(req.token());
        if (found.isEmpty()) {
            return error(400, "Enlace inválido o expirado");
        }

        User user = found.get();
        user.setPassword(encoder.encode(req.password()));
        user.setResetToken(null);
        user.setToken(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada"));
    }

    private Optional<User> findByHeader(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            return Optional.empty();
        }
        return userRepository.findByToken(header.substring(7));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }

    private boolean isEmpty(String value) {
        return value == null || value.isBlank();
    }

    private ResponseEntity<?> error(int status, String message) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}
