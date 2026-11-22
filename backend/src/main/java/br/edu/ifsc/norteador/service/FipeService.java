package br.edu.ifsc.norteador.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Consome a API gratuita da Tabela FIPE (https://deividfortuna.github.io/fipe/).
 * Não precisa de cadastro nem de chave. Como a API gratuita tem limite de requisições,
 * as respostas ficam guardadas em memória por 24 horas.
 */
@Service
public class FipeService {

    private static final Logger log = LoggerFactory.getLogger(FipeService.class);
    private static final Duration VALIDADE_CACHE = Duration.ofHours(24);

    /** Palavras que sozinhas não identificam o modelo (ex.: "Grand Siena", "New Beetle", "Santa Fe", "Land Cruiser") */
    private static final Set<String> PREFIXOS = Set.of("grand", "new", "nova", "novo", "nuevo", "super", "gran", "santa", "land", "range");

    // Formatos das respostas da FIPE (campos extras são ignorados)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record FipeMarca(String codigo, String nome) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record FipeModelo(String codigo, String nome) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record FipeModelos(List<FipeModelo> modelos) {}

    private record Cache<T>(T valor, Instant criadoEm) {
        boolean valido() {
            return criadoEm.plus(VALIDADE_CACHE).isAfter(Instant.now());
        }
    }

    private final RestClient http;
    private volatile Cache<List<FipeMarca>> cacheMarcas;
    private final Map<String, Cache<List<String>>> cacheModelos = new ConcurrentHashMap<>();

    public FipeService(@Value("${app.fipe.url}") String baseUrl) {
        SimpleClientHttpRequestFactory timeouts = new SimpleClientHttpRequestFactory();
        timeouts.setConnectTimeout(5_000);
        timeouts.setReadTimeout(10_000);
        this.http = RestClient.builder().baseUrl(baseUrl).requestFactory(timeouts).build();
    }

    /** Marcas de carros da FIPE, ou Optional.empty() se a API estiver fora do ar */
    public Optional<List<FipeMarca>> marcas() {
        Cache<List<FipeMarca>> c = cacheMarcas;
        if (c != null && c.valido()) return Optional.of(c.valor());
        try {
            FipeMarca[] resposta = http.get().uri("/carros/marcas").retrieve().body(FipeMarca[].class);
            List<FipeMarca> lista = resposta == null ? List.of() : List.of(resposta);
            cacheMarcas = new Cache<>(lista, Instant.now());
            return Optional.of(lista);
        } catch (Exception e) {
            log.warn("API FIPE indisponível ao buscar marcas: {}", e.getMessage());
            // Se já buscamos antes, usamos a lista antiga mesmo vencida
            return c != null ? Optional.of(c.valor()) : Optional.empty();
        }
    }

    /** Modelos de uma marca, já simplificados ("Gol 1.0 Mi Total Flex 8V" vira "Gol") */
    public List<String> modelos(String codigoMarca) {
        Cache<List<String>> c = cacheModelos.get(codigoMarca);
        if (c != null && c.valido()) return c.valor();
        try {
            FipeModelos resposta = http.get()
                    .uri("/carros/marcas/{codigo}/modelos", codigoMarca)
                    .retrieve()
                    .body(FipeModelos.class);
            List<String> lista = simplificar(resposta == null || resposta.modelos() == null ? List.of() : resposta.modelos());
            cacheModelos.put(codigoMarca, new Cache<>(lista, Instant.now()));
            return lista;
        } catch (Exception e) {
            log.warn("API FIPE indisponível ao buscar modelos da marca {}: {}", codigoMarca, e.getMessage());
            return c != null ? c.valor() : List.of();
        }
    }

    /** Pega só o nome principal de cada modelo e remove repetidos, em ordem alfabética */
    static List<String> simplificar(List<FipeModelo> modelos) {
        Map<String, String> unicos = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        for (FipeModelo m : modelos) {
            if (m.nome() == null || m.nome().isBlank()) continue;
            String[] palavras = m.nome().trim().split("\\s+");
            // Junta as palavras enquanto forem prefixos: "Grand Santa Fe" -> "Grand" + "Santa" + "Fe"
            StringBuilder nome = new StringBuilder(ajustarCaixa(palavras[0]));
            for (int i = 0; i + 1 < palavras.length && PREFIXOS.contains(palavras[i].toLowerCase()); i++) {
                nome.append(' ').append(ajustarCaixa(palavras[i + 1]));
            }
            String limpo = nome.toString().replaceAll("[/,].*$", ""); // "Strada/" e "Santa Fe/GLS" -> "Strada", "Santa Fe"
            if (!limpo.isBlank()) unicos.putIfAbsent(limpo, limpo);
        }
        return List.copyOf(unicos.values());
    }

    /** "AMAROK" vira "Amarok" e "UNO" vira "Uno"; nomes com números ou hífen ("S10", "HB20", "CR-V", "up!") ficam como estão */
    private static String ajustarCaixa(String palavra) {
        boolean soMaiusculas = palavra.length() >= 3 && palavra.chars().allMatch(Character::isUpperCase);
        if (!soMaiusculas) return palavra;
        return palavra.charAt(0) + palavra.substring(1).toLowerCase();
    }
}
