package br.edu.ifsc.norteador.service;

import br.edu.ifsc.norteador.dto.Dtos.AutomovelRequest;
import br.edu.ifsc.norteador.dto.Dtos.AutomovelResponse;
import br.edu.ifsc.norteador.model.Automovel;
import br.edu.ifsc.norteador.model.Cliente;
import br.edu.ifsc.norteador.repository.AutomovelRepository;
import br.edu.ifsc.norteador.repository.ClienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AutomovelService {

    private final AutomovelRepository automoveis;
    private final ClienteRepository clientes;

    public AutomovelService(AutomovelRepository automoveis, ClienteRepository clientes) {
        this.automoveis = automoveis;
        this.clientes = clientes;
    }

    @Transactional(readOnly = true)
    public List<AutomovelResponse> listar(Integer somenteDoCliente) {
        List<Automovel> lista = somenteDoCliente == null
                ? automoveis.listarComCliente()
                : automoveis.listarDoCliente(somenteDoCliente);
        return lista.stream().map(AutomovelResponse::of).toList();
    }

    @Transactional
    public AutomovelResponse cadastrar(AutomovelRequest req, Integer clienteId) {
        String placa = normalizarPlaca(req.placa());
        if (automoveis.existsByPlaca(placa)) {
            throw new ApiException(HttpStatus.CONFLICT, "Já existe um veículo com a placa " + placa);
        }
        Cliente dono = clientes.findById(clienteId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Sessão inválida"));

        Automovel a = new Automovel();
        a.setMarca(req.marca().trim());
        a.setModelo(req.modelo().trim());
        a.setPlaca(placa);
        a.setCliente(dono); // o veículo pertence a quem está logado (antes era cliente_id = 1 fixo)
        return AutomovelResponse.of(automoveis.save(a));
    }

    static String normalizarPlaca(String placa) {
        return placa.toUpperCase().replaceAll("[^A-Z0-9]", "");
    }
}
