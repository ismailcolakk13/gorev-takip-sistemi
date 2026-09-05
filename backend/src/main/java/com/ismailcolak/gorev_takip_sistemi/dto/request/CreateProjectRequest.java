package com.ismailcolak.gorev_takip_sistemi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record CreateProjectRequest(
        @NotBlank(message = "Proje adı boş olamaz")
        @Size(min = 3, max = 100, message = "Proje adı 3 ile 100 karakter arasında olmalıdır")
        String projectName
) {
}
