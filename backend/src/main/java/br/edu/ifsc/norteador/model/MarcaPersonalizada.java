package br.edu.ifsc.norteador.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/** Marca adicionada pelo usuário porque não existe na Tabela FIPE */
@Entity
@Table(name = "marcas_personalizadas")
public class MarcaPersonalizada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nome;

    @Column(name = "criado_em", insertable = false, updatable = false)
    private LocalDateTime criadoEm;

    public Integer getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
}
