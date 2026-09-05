package com.ismailcolak.gorev_takip_sistemi.dto.response;

import com.ismailcolak.gorev_takip_sistemi.entities.TaskPriority;
import com.ismailcolak.gorev_takip_sistemi.entities.TaskStatus;

public record TaskResponse(
        String publicId,
        String taskName,
        String taskDetail,
        TaskStatus status,
        TaskPriority priority,
        String projectPublicId,
        String assignedUserPublicId
) {
}
