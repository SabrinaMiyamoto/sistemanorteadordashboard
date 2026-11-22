package br.edu.ifsc.norteador.controller;

import br.edu.ifsc.norteador.dto.Dtos.MarcaRequest;
import br.edu.ifsc.norteador.dto.Dtos.MarcaResponse;
import br.edu.ifsc.norteador.dto.Dtos.MarcasResponse;
import br.edu.ifsc.norteador.service.MarcaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Marcas e modelos de carros: Tabela FIPE (API gratuita) + marcas adicionadas pelos usuários */
@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    private final MarcaService marcaService;

    public MarcaController(MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    /** GET /api/marcas — populares primeiro; "fipeDisponivel" indica se a FIPE respondeu */
    @GetMapping
    public MarcasResponse listar() {
        return marcaService.listar();
    }

    /** GET /api/marcas/fipe-59/modelos — modelos simplificados da marca */
    @GetMapping("/{codigo}/modelos")
    public List<String> modelos(@PathVariable String codigo) {
        return marcaService.modelos(codigo);
    }

    /** POST /api/marcas { "nome": "Troller" } — adiciona uma marca que não está na lista */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MarcaResponse adicionar(@Valid @RequestBody MarcaRequest req) {
        return marcaService.adicionar(req);
    }
}
