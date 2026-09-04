package com.ismailcolak.gorev_takip_sistemi.controllers;

import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateProjectRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.ProjectResponse;
import com.ismailcolak.gorev_takip_sistemi.services.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody @Valid CreateProjectRequest request){
        ProjectResponse response = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects(){
        List<ProjectResponse> response = projectService.getAllProjects();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{publicId}")
    public ResponseEntity<ProjectResponse> getProjectByPublicId(@PathVariable String publicId){
        ProjectResponse response = projectService.getProjectByPublicId(publicId);
        return ResponseEntity.ok(response);
    }


}
