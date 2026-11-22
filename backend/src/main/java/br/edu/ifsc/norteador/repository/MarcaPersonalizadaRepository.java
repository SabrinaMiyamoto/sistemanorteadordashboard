package br.edu.ifsc.norteador.repository;

import br.edu.ifsc.norteador.model.MarcaPersonalizada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarcaPersonalizadaRepository extends JpaRepository<MarcaPersonalizada, Integer> {
    List<MarcaPersonalizada> findAllByOrderByNomeAsc();

    boolean existsByNomeIgnoreCase(String nome);
}
