package com.ismailcolak.gorev_takip_sistemi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record CreateUserRequest(
        @NotBlank(message = "Kullanıcı adı boş olamaz")
        @Size(min = 3, max = 100, message = "Kullanıcı adı 3 ile 50 karakter arasında olmalıdır")
        String userName
) {
}
