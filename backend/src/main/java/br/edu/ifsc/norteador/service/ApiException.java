package br.edu.ifsc.norteador.service;

import org.springframework.http.HttpStatus;

/** Erro de regra de negócio que vira uma resposta HTTP com mensagem amigável. */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
