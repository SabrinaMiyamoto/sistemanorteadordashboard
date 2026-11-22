package br.edu.ifsc.norteador.repository;

import br.edu.ifsc.norteador.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByUsuario(String usuario);

    boolean existsByUsuario(String usuario);
}
