package com.ismailcolak.gorev_takip_sistemi.controllers;

import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateTaskRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.request.UpdateTaskStatusRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.TaskResponse;
import com.ismailcolak.gorev_takip_sistemi.services.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody @Valid CreateTaskRequest request) {
        TaskResponse taskResponse = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(taskResponse);
    }

    @GetMapping("/{publicId}")
    public ResponseEntity<TaskResponse> getTaskByPublicId(@PathVariable String publicId) {
        TaskResponse taskResponse = taskService.getTaskByPublicId(publicId);
        return ResponseEntity.ok(taskResponse);
    }

    @GetMapping("/by-project/{projectPublicId}")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(@PathVariable String projectPublicId) {
        List<TaskResponse> taskResponseList = taskService.getTasksByProject(projectPublicId);
        return ResponseEntity.ok(taskResponseList);
    }

    @GetMapping("/by-user/{userPublicId}")
    public ResponseEntity<List<TaskResponse>> getTasksByAssignedUser(@PathVariable String userPublicId) {
        List<TaskResponse> taskResponseList = taskService.getTasksByAssignedUser(userPublicId);
        return ResponseEntity.ok(taskResponseList);
    }

    @PatchMapping("/{taskPublicId}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable String taskPublicId, @RequestBody @Valid UpdateTaskStatusRequest request) {
        TaskResponse taskResponse = taskService.updateTaskStatus(taskPublicId, request);
        return ResponseEntity.ok(taskResponse);
    }

    @PutMapping("/{taskPublicId}/assign/{userPublicId}")
    public ResponseEntity<TaskResponse> assignTask(@PathVariable String taskPublicId, @PathVariable String userPublicId) {
        TaskResponse taskResponse = taskService.assignTask(taskPublicId, userPublicId);
        return ResponseEntity.ok(taskResponse);
    }
}
