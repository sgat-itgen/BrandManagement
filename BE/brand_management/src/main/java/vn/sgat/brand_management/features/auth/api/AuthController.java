package vn.sgat.brand_management.features.auth.api;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.sgat.brand_management.features.auth.domain.User;
import vn.sgat.brand_management.features.auth.service.AuthService;
import vn.sgat.brand_management.shared.security.SessionAuthenticationFilter;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        User user = authService.login(request);
        session.setAttribute(SessionAuthenticationFilter.SESSION_USER_ID, user.getId());
        return UserResponse.from(user);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(HttpSession session) {
        Object userId = session.getAttribute(SessionAuthenticationFilter.SESSION_USER_ID);
        if (!(userId instanceof Long id)) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(UserResponse.from(authService.find(id)));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

}
