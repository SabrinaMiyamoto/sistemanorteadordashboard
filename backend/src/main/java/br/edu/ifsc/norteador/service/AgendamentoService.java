package br.edu.ifsc.norteador.service;

import br.edu.ifsc.norteador.dto.Dtos.AgendamentoRequest;
import br.edu.ifsc.norteador.dto.Dtos.AgendamentoResponse;
import br.edu.ifsc.norteador.model.Agendamento;
import br.edu.ifsc.norteador.repository.AgendamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentos;

    public AgendamentoService(AgendamentoRepository agendamentos) {
        this.agendamentos = agendamentos;
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponse> listar() {
        return agendamentos.findAllByOrderByDataAgendadaAscHorarioAsc()
                .stream().map(AgendamentoResponse::of).toList();
    }

    @Transactional
    public AgendamentoResponse agendar(AgendamentoRequest req) {
        Agendamento a = new Agendamento();
        a.setServico(req.servico());
        a.setDataAgendada(req.data());
        a.setHorario(req.horario());
        a.setMarca(req.marca().trim());
        a.setModelo(req.modelo().trim());
        a.setPlaca(AutomovelService.normalizarPlaca(req.placa()));
        a.setObservacoes(req.observacoes());
        return AgendamentoResponse.of(agendamentos.save(a));
    }
}
