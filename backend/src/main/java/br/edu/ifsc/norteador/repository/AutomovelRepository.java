package br.edu.ifsc.norteador.repository;

import br.edu.ifsc.norteador.model.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AutomovelRepository extends JpaRepository<Automovel, Integer> {

    // Equivalente ao SELECT com LEFT JOIN do antigo listar_veiculos.php
    @Query("SELECT a FROM Automovel a LEFT JOIN FETCH a.cliente ORDER BY a.id")
    List<Automovel> listarComCliente();

    @Query("SELECT a FROM Automovel a JOIN FETCH a.cliente c WHERE c.id = :clienteId ORDER BY a.id")
    List<Automovel> listarDoCliente(@Param("clienteId") Integer clienteId);

    boolean existsByPlaca(String placa);
}
