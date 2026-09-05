package com.ismailcolak.gorev_takip_sistemi.controllers;

import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateUserRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.UserResponse;
import com.ismailcolak.gorev_takip_sistemi.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody @Valid CreateUserRequest request) {
        UserResponse userResponse = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> userResponse = userService.getAllUsers();
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/{publicId}")
    public ResponseEntity<UserResponse> getUserByPublicId(@PathVariable String publicId) {
        UserResponse userResponse = userService.getUserByPublicId(publicId);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/{userPublicId}/projects/{projectPublicId}")
    public ResponseEntity<Void> addUserToProject(@PathVariable String userPublicId, @PathVariable String projectPublicId) {
        userService.addUserToProject(userPublicId, projectPublicId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/by-project/{projectPublicId}")
    public ResponseEntity<List<UserResponse>> getUsersByProject(@PathVariable String projectPublicId) {
        List<UserResponse> userResponse = userService.getUsersByProject(projectPublicId);
        return ResponseEntity.ok(userResponse);
    }
}
