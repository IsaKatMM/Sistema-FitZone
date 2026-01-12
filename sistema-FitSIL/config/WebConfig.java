package sistema_FitSIL.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Exponer la carpeta imagenes_ejercicios para acceso público
        registry.addResourceHandler("/imagenes_ejercicios/**")
                .addResourceLocations("file:imagenes_ejercicios/");
    }
}