package br.edu.ifsc.norteador.config;

import br.edu.ifsc.norteador.dto.Dtos.ErroResponse;
import br.edu.ifsc.norteador.service.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/** Transforma exceções em JSON no formato { status, message }. */
@RestControllerAdvice
public class ErroHandler {

    private static final Logger log = LoggerFactory.getLogger(ErroHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErroResponse> api(ApiException e) {
        return erro(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> validacao(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getDefaultMessage())
                .findFirst().orElse("Dados inválidos");
        return erro(HttpStatus.BAD_REQUEST, msg);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponse> jsonInvalido(HttpMessageNotReadableException e) {
        return erro(HttpStatus.BAD_REQUEST, "Formato de dados inválido");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> integridade(DataIntegrityViolationException e) {
        return erro(HttpStatus.CONFLICT, "Registro duplicado ou inválido");
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErroResponse> naoEncontrado(NoResourceFoundException e) {
        return erro(HttpStatus.NOT_FOUND, "Rota não encontrada");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> geral(Exception e) {
        log.error("Erro inesperado", e);
        return erro(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno no servidor");
    }

    private ResponseEntity<ErroResponse> erro(HttpStatus status, String msg) {
        return ResponseEntity.status(status).body(new ErroResponse(status.value(), msg));
    }
}
