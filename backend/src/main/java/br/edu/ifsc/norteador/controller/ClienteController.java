package br.edu.ifsc.norteador.controller;

import br.edu.ifsc.norteador.dto.Dtos.ClienteRequest;
import br.edu.ifsc.norteador.dto.Dtos.ClienteResponse;
import br.edu.ifsc.norteador.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** Substitui o processa_cadastro.php */
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    /** POST /api/clientes — cadastro público de novo cliente */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteResponse cadastrar(@Valid @RequestBody ClienteRequest req) {
        return clienteService.cadastrar(req);
    }
}
