package br.edu.ifsc.norteador.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Guarda as sessões de login em memória: token -> id do cliente.
 * Simples de entender; ao reiniciar o servidor todos precisam logar de novo.
 */
@Service
public class TokenService {

    private final Map<String, Integer> sessoes = new ConcurrentHashMap<>();

    public String criar(Integer clienteId) {
        String token = UUID.randomUUID().toString();
        sessoes.put(token, clienteId);
        return token;
    }

    public Optional<Integer> clienteDoToken(String token) {
        return Optional.ofNullable(token).map(sessoes::get);
    }

    public void remover(String token) {
        if (token != null) {
            sessoes.remove(token);
        }
    }
}
