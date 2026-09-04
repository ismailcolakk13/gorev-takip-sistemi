package com.ismailcolak.gorev_takip_sistemi.services;

import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateTaskRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.request.UpdateTaskStatusRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.TaskResponse;
import com.ismailcolak.gorev_takip_sistemi.entities.Project;
import com.ismailcolak.gorev_takip_sistemi.entities.Task;
import com.ismailcolak.gorev_takip_sistemi.entities.TaskPriority;
import com.ismailcolak.gorev_takip_sistemi.entities.TaskStatus;
import com.ismailcolak.gorev_takip_sistemi.entities.User;
import com.ismailcolak.gorev_takip_sistemi.repositories.ProjectRepository;
import com.ismailcolak.gorev_takip_sistemi.repositories.TaskRepository;
import com.ismailcolak.gorev_takip_sistemi.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private Project sampleProject;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleProject = new Project();
        sampleProject.setProjectId(1L);
        sampleProject.setProjectName("BİLGEM Projesi");

        sampleUser = new User();
        sampleUser.setUserId(1L);
        sampleUser.setUserName("ismail");
    }

    @Test
    @DisplayName("Proje üyesi olan kullanıcıya görev atanarak başarıyla görev oluşturulmalı")
    void createTask_WhenUserIsMember_ShouldCreateTaskSuccessfully() {
        // Given
        sampleUser.getProjects().add(sampleProject);

        CreateTaskRequest request = new CreateTaskRequest(
                "Task Tracker Geliştir",
                "Spring Boot ve JPA ile geliştirme yap",
                TaskPriority.HIGH,
                sampleProject.getPublicId(),
                sampleUser.getPublicId()
        );

        when(projectRepository.findByPublicId(sampleProject.getPublicId())).thenReturn(Optional.of(sampleProject));
        when(userRepository.findByPublicId(sampleUser.getPublicId())).thenReturn(Optional.of(sampleUser));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        TaskResponse response = taskService.createTask(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.taskName()).isEqualTo("Task Tracker Geliştir");
        assertThat(response.status()).isEqualTo(TaskStatus.TODO);
        assertThat(response.priority()).isEqualTo(TaskPriority.HIGH);
        assertThat(response.projectPublicId()).isEqualTo(sampleProject.getPublicId());
        assertThat(response.assignedUserPublicId()).isEqualTo(sampleUser.getPublicId());

        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Kullanıcı projeye üye değilse görev oluştururken IllegalArgumentException fırlatılmalı")
    void createTask_WhenUserIsNotMember_ShouldThrowIllegalArgumentException() {
        // Given (sampleUser sampleProject'e eklenmedi)
        CreateTaskRequest request = new CreateTaskRequest(
                "Görev Başlığı",
                "Detay",
                TaskPriority.MEDIUM,
                sampleProject.getPublicId(),
                sampleUser.getPublicId()
        );

        when(projectRepository.findByPublicId(sampleProject.getPublicId())).thenReturn(Optional.of(sampleProject));
        when(userRepository.findByPublicId(sampleUser.getPublicId())).thenReturn(Optional.of(sampleUser));

        // When & Then
        assertThatThrownBy(() -> taskService.createTask(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Kullanıcı bu projede değil");

        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    @DisplayName("Proje bulunamazsa EntityNotFoundException fırlatılmalı")
    void createTask_WhenProjectNotFound_ShouldThrowEntityNotFoundException() {
        // Given
        CreateTaskRequest request = new CreateTaskRequest(
                "Görev",
                "Detay",
                TaskPriority.LOW,
                "gecersiz-proje-id",
                null
        );

        when(projectRepository.findByPublicId("gecersiz-proje-id")).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> taskService.createTask(request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Proje bulunamadı");
    }

    @Test
    @DisplayName("Atanan kullanıcı olmadan görev başarıyla oluşturulmalı")
    void createTask_WithoutAssignedUser_ShouldCreateTaskSuccessfully() {
        // Given
        CreateTaskRequest request = new CreateTaskRequest(
                "Sahipsiz Görev",
                "Açıklama",
                TaskPriority.LOW,
                sampleProject.getPublicId(),
                null
        );

        when(projectRepository.findByPublicId(sampleProject.getPublicId())).thenReturn(Optional.of(sampleProject));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        TaskResponse response = taskService.createTask(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.taskName()).isEqualTo("Sahipsiz Görev");
        assertThat(response.assignedUserPublicId()).isNull();
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Görev durumu başarıyla güncellenmeli")
    void updateTaskStatus_WhenTaskExists_ShouldUpdateStatus() {
        // Given
        Task task = new Task();
        task.setTaskName("Test Görevi");
        task.setTaskStatus(TaskStatus.TODO);
        task.setProject(sampleProject);

        UpdateTaskStatusRequest request = new UpdateTaskStatusRequest(TaskStatus.IN_PROGRESS);

        when(taskRepository.findByPublicId(task.getPublicId())).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        TaskResponse response = taskService.updateTaskStatus(task.getPublicId(), request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.status()).isEqualTo(TaskStatus.IN_PROGRESS);
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    @DisplayName("Proje üyesi olan kullanıcıya görev sonradan atanabilmeli")
    void assignTask_WhenUserIsProjectMember_ShouldAssignSuccessfully() {
        // Given
        sampleUser.getProjects().add(sampleProject);

        Task task = new Task();
        task.setTaskName("Mevcut Görev");
        task.setTaskStatus(TaskStatus.TODO);
        task.setProject(sampleProject);

        when(taskRepository.findByPublicId(task.getPublicId())).thenReturn(Optional.of(task));
        when(userRepository.findByPublicId(sampleUser.getPublicId())).thenReturn(Optional.of(sampleUser));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        TaskResponse response = taskService.assignTask(task.getPublicId(), sampleUser.getPublicId());

        // Then
        assertThat(response).isNotNull();
        assertThat(response.assignedUserPublicId()).isEqualTo(sampleUser.getPublicId());
        verify(taskRepository, times(1)).save(task);
    }
}
