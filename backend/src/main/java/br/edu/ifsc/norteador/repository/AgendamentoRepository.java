package br.edu.ifsc.norteador.repository;

import br.edu.ifsc.norteador.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {
    List<Agendamento> findAllByOrderByDataAgendadaAscHorarioAsc();
}
