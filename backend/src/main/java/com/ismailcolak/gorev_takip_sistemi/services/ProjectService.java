package com.ismailcolak.gorev_takip_sistemi.services;

import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateProjectRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.ProjectResponse;
import com.ismailcolak.gorev_takip_sistemi.entities.Project;
import com.ismailcolak.gorev_takip_sistemi.repositories.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(final ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public ProjectResponse createProject(CreateProjectRequest createProjectRequest) {
        Project project = new Project();
        project.setProjectName(createProjectRequest.projectName());
        projectRepository.save(project);

        return new ProjectResponse(project.getPublicId(), project.getProjectName());
    }

    public ProjectResponse getProjectByPublicId(String publicId) {
        Project project = projectRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Proje bulunamadı: " + publicId));

        return new ProjectResponse(project.getPublicId(), project.getProjectName());
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(p -> new ProjectResponse(p.getPublicId(), p.getProjectName()))
                .toList();
    }
}
