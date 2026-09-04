package com.ismailcolak.gorev_takip_sistemi.services;

import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateTaskRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.request.UpdateTaskStatusRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.TaskResponse;
import com.ismailcolak.gorev_takip_sistemi.entities.*;
import com.ismailcolak.gorev_takip_sistemi.repositories.ProjectRepository;
import com.ismailcolak.gorev_takip_sistemi.repositories.TaskRepository;
import com.ismailcolak.gorev_takip_sistemi.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public TaskResponse createTask(CreateTaskRequest request) {
        Project project = projectRepository.findByPublicId(request.projectPublicId())
                .orElseThrow(() -> new EntityNotFoundException("Görev oluşturma başarısız\nProje bulunamadı: " + request.projectPublicId()));

        User user = null;
        if (request.assignedUserPublicId() != null && !request.assignedUserPublicId().isBlank()) {
            user = userRepository.findByPublicId(request.assignedUserPublicId())
                    .orElseThrow(() -> new IllegalArgumentException("Görev oluşturma başarısız\nKullanıcı bulunamadı: " + request.assignedUserPublicId()));
        }

        if (user != null) {
            if (!isMemberOfProject(user, project)) {
                throw new IllegalArgumentException("Görev oluşturma başarısız\nKullanıcı bu projede değil:" + user.getPublicId());
            }
        }

        Task task = new Task();
        task.setTaskName(request.taskName());
        task.setTaskDetail(request.taskDetail());
        task.setTaskPriority(request.priority());
        task.setTaskStatus(TaskStatus.TODO);
        task.setProject(project);
        task.setAssignedUser(user);

        taskRepository.save(task);

        return mapToResponse(task);
    }


    public TaskResponse assignTask(String taskPublicId, String userPublicId) {
        Task task = taskRepository.findByPublicId(taskPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Görev atama başarısız\nGörev bulunamadı: " + taskPublicId));

        User user = userRepository.findByPublicId(userPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Görev atama başarısız\nKullanıcı bulunamadı: " + userPublicId));

        if (!isMemberOfProject(user, task.getProject())) {
            throw new IllegalArgumentException("Görev atama başarısız\nKullanıcı " + userPublicId + " bu projede " + taskPublicId + " değil");
        }

        task.setAssignedUser(user);
        taskRepository.save(task);

        return mapToResponse(task);
    }


    public TaskResponse updateTaskStatus(String taskPublicId, UpdateTaskStatusRequest request) {
        Task task = taskRepository.findByPublicId(taskPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Görev atama başarısız\nGörev bulunamadı: " + taskPublicId));

        task.setTaskStatus(request.status());
        taskRepository.save(task);

        return mapToResponse(task);
    }

    public List<TaskResponse> getTasksByProject(String projectPublicId) {
        List<Task> tasks = taskRepository.findByProject_PublicId(projectPublicId);

        return tasks.stream()
                .map(t -> mapToResponse(t))
                .toList();
    }

    public List<TaskResponse> getTasksByAssignedUser(String userPublicId) {
        List<Task> tasks = taskRepository.findByAssignedUser_PublicId(userPublicId);

        return tasks.stream()
                .map(t -> mapToResponse(t))
                .toList();
    }

    public TaskResponse getTaskByPublicId(String taskPublicId) {
        Task task = taskRepository.findByPublicId(taskPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Görev getirme başarısız\nGörev bulunamadı: " + taskPublicId));

        return mapToResponse(task);
    }


    private TaskResponse mapToResponse(Task task) {
        return new TaskResponse(
                task.getPublicId(),
                task.getTaskName(),
                task.getTaskDetail(),
                task.getTaskStatus(),
                task.getTaskPriority(),
                task.getProject().getPublicId(),
                task.getAssignedUser() != null ? task.getAssignedUser().getPublicId() : null
        );
    }

    private boolean isMemberOfProject(User user, Project project) {
        boolean isMember = user.getProjects().stream()
                .anyMatch(p -> p.getPublicId().equals(project.getPublicId()));

        return isMember;
    }
}


