package br.edu.ifsc.norteador.config;

import br.edu.ifsc.norteador.service.ApiException;
import br.edu.ifsc.norteador.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Protege as rotas da API: exige o cabeçalho "Authorization: Bearer <token>"
 * recebido no login. O id do cliente logado fica disponível em request.getAttribute(CLIENTE_ID).
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {

    public static final String CLIENTE_ID = "clienteId";

    private final TokenService tokens;

    public AuthInterceptor(TokenService tokens) {
        this.tokens = tokens;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true; // pré-requisição do CORS
        }
        Integer clienteId = tokens.clienteDoToken(extrairToken(request))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Faça login para continuar"));
        request.setAttribute(CLIENTE_ID, clienteId);
        return true;
    }

    public static String extrairToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7).trim();
        }
        return null;
    }
}
