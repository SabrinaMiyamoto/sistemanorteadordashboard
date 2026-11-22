package br.edu.ifsc.norteador.dto;

import br.edu.ifsc.norteador.model.Agendamento;
import br.edu.ifsc.norteador.model.Automovel;
import br.edu.ifsc.norteador.model.Cliente;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Objetos de entrada (Request) e saída (Response) da API.
 * Ficam todos juntos para facilitar a leitura em sala de aula.
 */
public final class Dtos {

    private Dtos() {}

    // ---------- Autenticação ----------

    public record LoginRequest(
            @NotBlank(message = "Informe o usuário") String usuario,
            @NotBlank(message = "Informe a senha") String senha) {}

    public record LoginResponse(String token, ClienteResponse cliente) {}

    // ---------- Clientes (antigo processa_cadastro.php) ----------

    public record ClienteRequest(
            @NotBlank(message = "Informe o nome") @Size(max = 100) String nome,
            @Size(max = 255) String endereco,
            @Size(max = 20) String celular,
            @NotBlank(message = "Informe o e-mail") @Email(message = "E-mail inválido") @Size(max = 100) String email,
            @NotBlank(message = "Informe o usuário") @Size(max = 50) String usuario,
            @NotBlank(message = "Informe a senha") @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres") String senha) {}

    public record ClienteResponse(Integer id, String nome, String email, String usuario,
                                  String celular, String endereco) {
        public static ClienteResponse of(Cliente c) {
            return new ClienteResponse(c.getId(), c.getNome(), c.getEmail(), c.getUsuario(),
                    c.getCelular(), c.getEndereco());
        }
    }

    // ---------- Automóveis (antigos processa_automoveis.php e listar_veiculos.php) ----------

    public record AutomovelRequest(
            @NotBlank(message = "Informe a marca") @Size(max = 50) String marca,
            @NotBlank(message = "Informe o modelo") @Size(max = 50) String modelo,
            @NotBlank(message = "Informe a placa") @Size(max = 10) String placa) {}

    public record AutomovelResponse(Integer id, String marca, String modelo, String placa,
                                    Integer clienteId, String clienteNome, LocalDateTime criadoEm) {
        public static AutomovelResponse of(Automovel a) {
            Cliente c = a.getCliente();
            return new AutomovelResponse(a.getId(), a.getMarca(), a.getModelo(), a.getPlaca(),
                    c != null ? c.getId() : null, c != null ? c.getNome() : null, a.getCriadoEm());
        }
    }

    // ---------- Agendamentos (antigo processa_agendamento.php) ----------

    public record AgendamentoRequest(
            @NotBlank(message = "Escolha um serviço") @Size(max = 150) String servico,
            @NotNull(message = "Informe a data") LocalDate data,
            @NotNull(message = "Informe o horário") LocalTime horario,
            @NotBlank(message = "Informe a marca") @Size(max = 50) String marca,
            @NotBlank(message = "Informe o modelo") @Size(max = 50) String modelo,
            @NotBlank(message = "Informe a placa") @Size(max = 10) String placa,
            String observacoes) {}

    public record AgendamentoResponse(Integer id, String servico, LocalDate data, LocalTime horario,
                                      String marca, String modelo, String placa, String observacoes,
                                      LocalDateTime criadoEm) {
        public static AgendamentoResponse of(Agendamento a) {
            return new AgendamentoResponse(a.getId(), a.getServico(), a.getDataAgendada(), a.getHorario(),
                    a.getMarca(), a.getModelo(), a.getPlaca(), a.getObservacoes(), a.getCriadoEm());
        }
    }

    // ---------- Marcas e modelos (Tabela FIPE + personalizadas) ----------

    public record MarcaRequest(
            @NotBlank(message = "Informe o nome da marca") @Size(max = 50, message = "Nome da marca muito longo") String nome) {}

    /** origem: "FIPE" ou "PERSONALIZADA". codigo é null quando a FIPE está fora do ar. */
    public record MarcaResponse(String codigo, String nome, boolean popular, String origem) {}

    public record MarcasResponse(java.util.List<MarcaResponse> marcas, boolean fipeDisponivel) {}

    // ---------- Erros ----------

    public record ErroResponse(int status, String message) {}
}
