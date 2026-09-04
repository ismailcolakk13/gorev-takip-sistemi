package com.ismailcolak.gorev_takip_sistemi.dto.response;

public record CommentResponse(
        String publicId,
        String commentDetail,
        String commentedUserPublicId,
        String taskPublicId
) {
}
