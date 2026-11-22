package br.edu.ifsc.norteador.service;

import br.edu.ifsc.norteador.dto.Dtos.MarcaRequest;
import br.edu.ifsc.norteador.dto.Dtos.MarcaResponse;
import br.edu.ifsc.norteador.dto.Dtos.MarcasResponse;
import br.edu.ifsc.norteador.model.MarcaPersonalizada;
import br.edu.ifsc.norteador.repository.MarcaPersonalizadaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.*;

/**
 * Junta as marcas da Tabela FIPE com as marcas personalizadas (salvas no MySQL).
 * Códigos: "fipe-23" para marcas da FIPE e "p-5" para personalizadas.
 */
@Service
public class MarcaService {

    private static final Logger log = LoggerFactory.getLogger(MarcaService.class);
    private static final String FIPE = "fipe-";
    private static final String PERSONALIZADA = "p-";

    /** Marcas mais vendidas no Brasil: aparecem no topo da lista. Também são usadas se a FIPE estiver fora do ar. */
    private static final List<String> POPULARES = List.of(
            "Fiat", "Volkswagen", "Chevrolet", "Toyota", "Hyundai", "Jeep", "Renault", "Honda",
            "Nissan", "BYD", "Caoa Chery", "Peugeot", "Citroën", "Ford", "Mitsubishi");

    private final FipeService fipe;
    private final MarcaPersonalizadaRepository personalizadas;

    public MarcaService(FipeService fipe, MarcaPersonalizadaRepository personalizadas) {
        this.fipe = fipe;
        this.personalizadas = personalizadas;
    }

    public MarcasResponse listar() {
        List<MarcaResponse> marcas = new ArrayList<>();
        Optional<List<FipeService.FipeMarca>> daFipe = fipe.marcas();

        if (daFipe.isPresent()) {
            for (FipeService.FipeMarca m : daFipe.get()) {
                String nome = nomeAmigavel(m.nome());
                marcas.add(new MarcaResponse(FIPE + m.codigo(), nome, ehPopular(nome), "FIPE"));
            }
        } else {
            // FIPE fora do ar: pelo menos as populares aparecem (sem lista de modelos)
            for (String nome : POPULARES) {
                marcas.add(new MarcaResponse(null, nome, true, "FIPE"));
            }
        }

        try {
            for (MarcaPersonalizada p : personalizadas.findAllByOrderByNomeAsc()) {
                marcas.add(new MarcaResponse(PERSONALIZADA + p.getId(), p.getNome(), false, "PERSONALIZADA"));
            }
        } catch (DataAccessException e) {
            // Ex.: tabela marcas_personalizadas não existe. As marcas da FIPE continuam aparecendo.
            log.warn("Não foi possível ler as marcas personalizadas: {}", e.getMostSpecificCause().getMessage());
        }

        marcas.sort(Comparator.comparing((MarcaResponse m) -> !m.popular())
                .thenComparing(m -> m.popular() ? POPULARES.indexOf(m.nome()) : 0)
                .thenComparing(m -> chave(m.nome())));
        return new MarcasResponse(marcas, daFipe.isPresent());
    }

    /** Modelos da marca. Marcas personalizadas não têm lista: o modelo é digitado livremente. */
    public List<String> modelos(String codigo) {
        if (codigo != null && codigo.startsWith(FIPE)) {
            String codigoFipe = codigo.substring(FIPE.length());
            if (codigoFipe.matches("\\d+")) return fipe.modelos(codigoFipe);
        }
        return List.of();
    }

    @Transactional
    public MarcaResponse adicionar(MarcaRequest req) {
        String nome = req.nome().trim().replaceAll("\\s+", " ");
        boolean jaExiste = personalizadas.existsByNomeIgnoreCase(nome)
                || listar().marcas().stream().anyMatch(m -> chave(m.nome()).equals(chave(nome)));
        if (jaExiste) {
            throw new ApiException(HttpStatus.CONFLICT, "A marca \"" + nome + "\" já está na lista");
        }
        MarcaPersonalizada p = new MarcaPersonalizada();
        p.setNome(nome);
        p = personalizadas.save(p);
        return new MarcaResponse(PERSONALIZADA + p.getId(), p.getNome(), false, "PERSONALIZADA");
    }

    /** A FIPE usa nomes como "GM - Chevrolet" e "VW - VolksWagen"; aqui viram "Chevrolet" e "Volkswagen" */
    static String nomeAmigavel(String nomeFipe) {
        String nome = nomeFipe.contains(" - ") ? nomeFipe.substring(nomeFipe.indexOf(" - ") + 3) : nomeFipe;
        if (nome.equalsIgnoreCase("VolksWagen")) return "Volkswagen";
        if (nome.equalsIgnoreCase("Kia Motors")) return "Kia";
        return nome.trim();
    }

    private boolean ehPopular(String nome) {
        return POPULARES.contains(nome);
    }

    /** Compara nomes sem acento e sem diferenciar maiúsculas ("Citroen" = "Citroën") */
    private static String chave(String nome) {
        return Normalizer.normalize(nome, Normalizer.Form.NFD).replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT).trim();
    }
}
