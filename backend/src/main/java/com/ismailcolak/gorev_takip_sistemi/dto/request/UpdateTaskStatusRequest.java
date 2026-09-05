package com.ismailcolak.gorev_takip_sistemi.dto.request;

import com.ismailcolak.gorev_takip_sistemi.entities.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTaskStatusRequest(
        @NotNull(message = "(Update) Görev önceliği seçin")
        TaskStatus status
) {
}
