package com.ismailcolak.gorev_takip_sistemi.controllers;

import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateCommentRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.CommentResponse;
import com.ismailcolak.gorev_takip_sistemi.services.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskPublicId}/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@PathVariable String taskPublicId, @RequestBody @Valid CreateCommentRequest request) {
        CommentResponse commentResponse = commentService.addComment(taskPublicId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentResponse);
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getCommentsByTask(@PathVariable String taskPublicId) {
        List<CommentResponse> comments = commentService.getCommentsByTask(taskPublicId);
        return ResponseEntity.ok(comments);
    }
}
