package com.ismailcolak.gorev_takip_sistemi.services;

import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateUserRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.UserResponse;
import com.ismailcolak.gorev_takip_sistemi.entities.Project;
import com.ismailcolak.gorev_takip_sistemi.entities.User;
import com.ismailcolak.gorev_takip_sistemi.repositories.ProjectRepository;
import com.ismailcolak.gorev_takip_sistemi.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Yeni kullanıcı başarıyla oluşturulmalı")
    void createUser_ShouldSaveAndReturnUserResponse() {
        // Given
        CreateUserRequest request = new CreateUserRequest("ahmet");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        UserResponse response = userService.createUser(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.userName()).isEqualTo("ahmet");
        assertThat(response.publicId()).isNotBlank();
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Var olan kullanıcı publicId ile getirilmeli")
    void getUserByPublicId_WhenExists_ShouldReturnUserResponse() {
        // Given
        User user = new User();
        user.setUserName("mehmet");
        when(userRepository.findByPublicId(user.getPublicId())).thenReturn(Optional.of(user));

        // When
        UserResponse response = userService.getUserByPublicId(user.getPublicId());

        // Then
        assertThat(response).isNotNull();
        assertThat(response.userName()).isEqualTo("mehmet");
        assertThat(response.publicId()).isEqualTo(user.getPublicId());
    }

    @Test
    @DisplayName("Kullanıcı bulunamadığında EntityNotFoundException fırlatılmalı")
    void getUserByPublicId_WhenNotFound_ShouldThrowEntityNotFoundException() {
        // Given
        when(userRepository.findByPublicId("tanimsiz-id")).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.getUserByPublicId("tanimsiz-id"))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Kulanıcı bulunamadı");
    }

    @Test
    @DisplayName("Kullanıcı başarıyla projeye eklenmeli")
    void addUserToProject_ShouldAddProjectToUserAndSave() {
        // Given
        User user = new User();
        user.setUserName("ismail");

        Project project = new Project();
        project.setProjectName("Yeni Nesil Radar");

        when(projectRepository.findByPublicId(project.getPublicId())).thenReturn(Optional.of(project));
        when(userRepository.findByPublicId(user.getPublicId())).thenReturn(Optional.of(user));

        // When
        userService.addUserToProject(user.getPublicId(), project.getPublicId());

        // Then
        assertThat(user.getProjects()).contains(project);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    @DisplayName("Tüm kullanıcılar listelenebilmeli")
    void getAllUsers_ShouldReturnListOfUserResponse() {
        // Given
        User user1 = new User();
        user1.setUserName("ali");
        User user2 = new User();
        user2.setUserName("veli");

        when(userRepository.findAll()).thenReturn(List.of(user1, user2));

        // When
        List<UserResponse> list = userService.getAllUsers();

        // Then
        assertThat(list).hasSize(2);
        assertThat(list.stream().map(UserResponse::userName)).containsExactly("ali", "veli");
    }
}
