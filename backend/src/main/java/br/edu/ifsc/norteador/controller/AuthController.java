package br.edu.ifsc.norteador.controller;

import br.edu.ifsc.norteador.config.AuthInterceptor;
import br.edu.ifsc.norteador.dto.Dtos.ClienteResponse;
import br.edu.ifsc.norteador.dto.Dtos.LoginRequest;
import br.edu.ifsc.norteador.dto.Dtos.LoginResponse;
import br.edu.ifsc.norteador.service.ClienteService;
import br.edu.ifsc.norteador.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final ClienteService clienteService;
    private final TokenService tokens;

    public AuthController(ClienteService clienteService, TokenService tokens) {
        this.clienteService = clienteService;
        this.tokens = tokens;
    }

    /** POST /api/auth/login  { "usuario": "...", "senha": "..." } */
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return clienteService.login(req);
    }

    /** GET /api/auth/me — dados do cliente logado (rota protegida) */
    @GetMapping("/me")
    public ClienteResponse me(@RequestAttribute(AuthInterceptor.CLIENTE_ID) Integer clienteId) {
        return clienteService.buscar(clienteId);
    }

    /** POST /api/auth/logout — invalida o token atual */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        tokens.remover(AuthInterceptor.extrairToken(request));
        return ResponseEntity.noContent().build();
    }
}
