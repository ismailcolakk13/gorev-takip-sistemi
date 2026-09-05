package com.ismailcolak.gorev_takip_sistemi.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateCommentRequest(
        @NotBlank(message = "yorum boş olamaz")
        String commentDetail,
        @NotBlank(message = "yorumu yapan yok")
        String userPublicId
) {
}
