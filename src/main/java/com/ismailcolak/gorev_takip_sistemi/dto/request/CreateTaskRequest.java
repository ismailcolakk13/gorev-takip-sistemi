package com.ismailcolak.gorev_takip_sistemi.dto.request;

import com.ismailcolak.gorev_takip_sistemi.entities.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTaskRequest(
        @NotBlank(message = "Görev adı boş olamaz")
        String taskName,
        String taskDetail,
        @NotNull(message = "Görev önceliği seçmek zorunludur")
        TaskPriority priority,
        @NotBlank
        String projectPublicId,
        String assignedUserPublicId
) {
}
