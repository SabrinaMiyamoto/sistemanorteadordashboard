package br.edu.ifsc.norteador.controller;

import br.edu.ifsc.norteador.dto.Dtos.AgendamentoRequest;
import br.edu.ifsc.norteador.dto.Dtos.AgendamentoResponse;
import br.edu.ifsc.norteador.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Substitui o processa_agendamento.php */
@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    /** GET /api/agendamentos */
    @GetMapping
    public List<AgendamentoResponse> listar() {
        return agendamentoService.listar();
    }

    /** POST /api/agendamentos */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AgendamentoResponse agendar(@Valid @RequestBody AgendamentoRequest req) {
        return agendamentoService.agendar(req);
    }
}
