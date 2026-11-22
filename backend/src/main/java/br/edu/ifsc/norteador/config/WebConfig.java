package br.edu.ifsc.norteador.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;
    private final String corsOrigin;

    public WebConfig(AuthInterceptor authInterceptor, @Value("${app.cors.origin}") String corsOrigin) {
        this.authInterceptor = authInterceptor;
        this.corsOrigin = corsOrigin;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**")
                // Rotas públicas: login e cadastro de novo cliente
                .excludePathPatterns("/api/auth/login", "/api/clientes");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // Aceita uma ou mais origens separadas por vírgula; "*" na porta libera qualquer porta
                .allowedOriginPatterns(corsOrigin.split("\\s*,\\s*"))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
