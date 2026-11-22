package br.edu.ifsc.norteador.controller;

import br.edu.ifsc.norteador.config.AuthInterceptor;
import br.edu.ifsc.norteador.dto.Dtos.AutomovelRequest;
import br.edu.ifsc.norteador.dto.Dtos.AutomovelResponse;
import br.edu.ifsc.norteador.service.AutomovelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Substitui o processa_automoveis.php e o listar_veiculos.php */
@RestController
@RequestMapping("/api/automoveis")
public class AutomovelController {

    private final AutomovelService automovelService;

    public AutomovelController(AutomovelService automovelService) {
        this.automovelService = automovelService;
    }

    /** GET /api/automoveis  (ou /api/automoveis?meus=true para só os do cliente logado) */
    @GetMapping
    public List<AutomovelResponse> listar(@RequestParam(defaultValue = "false") boolean meus,
                                          @RequestAttribute(AuthInterceptor.CLIENTE_ID) Integer clienteId) {
        return automovelService.listar(meus ? clienteId : null);
    }

    /** POST /api/automoveis — o veículo fica vinculado ao cliente logado */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AutomovelResponse cadastrar(@Valid @RequestBody AutomovelRequest req,
                                       @RequestAttribute(AuthInterceptor.CLIENTE_ID) Integer clienteId) {
        return automovelService.cadastrar(req, clienteId);
    }
}
