package br.edu.ifsc.norteador.service;

import br.edu.ifsc.norteador.dto.Dtos.ClienteRequest;
import br.edu.ifsc.norteador.dto.Dtos.LoginRequest;
import br.edu.ifsc.norteador.dto.Dtos.LoginResponse;
import br.edu.ifsc.norteador.dto.Dtos.ClienteResponse;
import br.edu.ifsc.norteador.model.Cliente;
import br.edu.ifsc.norteador.repository.ClienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClienteService {

    private final ClienteRepository clientes;
    private final TokenService tokens;
    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();

    public ClienteService(ClienteRepository clientes, TokenService tokens) {
        this.clientes = clientes;
        this.tokens = tokens;
    }

    @Transactional
    public ClienteResponse cadastrar(ClienteRequest req) {
        String usuario = req.usuario().trim();
        if (clientes.existsByUsuario(usuario)) {
            throw new ApiException(HttpStatus.CONFLICT, "Este nome de usuário já está em uso");
        }
        Cliente c = new Cliente();
        c.setNome(req.nome().trim());
        c.setEndereco(req.endereco());
        c.setCelular(req.celular());
        c.setEmail(req.email().trim());
        c.setUsuario(usuario);
        c.setSenha(bcrypt.encode(req.senha())); // a senha nunca é salva em texto puro
        return ClienteResponse.of(clientes.save(c));
    }

    @Transactional
    public LoginResponse login(LoginRequest req) {
        Cliente c = clientes.findByUsuario(req.usuario().trim())
                .orElseThrow(this::credenciaisInvalidas);

        if (!senhaConfere(req.senha(), c.getSenha())) {
            throw credenciaisInvalidas();
        }

        // Os usuários do dump.sql têm senha em texto puro: no primeiro login a senha é convertida para BCrypt
        if (!ehBcrypt(c.getSenha())) {
            c.setSenha(bcrypt.encode(req.senha()));
        }

        return new LoginResponse(tokens.criar(c.getId()), ClienteResponse.of(c));
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscar(Integer id) {
        return clientes.findById(id)
                .map(ClienteResponse::of)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Sessão inválida"));
    }

    private boolean senhaConfere(String digitada, String salva) {
        if (salva == null) return false;
        return ehBcrypt(salva) ? bcrypt.matches(digitada, salva) : salva.equals(digitada);
    }

    private boolean ehBcrypt(String senha) {
        return senha != null && senha.startsWith("$2");
    }

    private ApiException credenciaisInvalidas() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos");
    }
}
