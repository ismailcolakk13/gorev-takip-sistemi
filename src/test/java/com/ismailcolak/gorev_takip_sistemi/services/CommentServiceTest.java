package com.ismailcolak.gorev_takip_sistemi.services;

import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateCommentRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.CommentResponse;
import com.ismailcolak.gorev_takip_sistemi.entities.Comment;
import com.ismailcolak.gorev_takip_sistemi.entities.Project;
import com.ismailcolak.gorev_takip_sistemi.entities.Task;
import com.ismailcolak.gorev_takip_sistemi.entities.User;
import com.ismailcolak.gorev_takip_sistemi.repositories.CommentRepository;
import com.ismailcolak.gorev_takip_sistemi.repositories.TaskRepository;
import com.ismailcolak.gorev_takip_sistemi.repositories.UserRepository;
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
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private CommentService commentService;

    @Test
    @DisplayName("Proje üyesi olan kullanıcı göreve başarıyla yorum yapabilmeli")
    void addComment_WhenUserIsProjectMember_ShouldAddCommentSuccessfully() {
        // Given
        Project project = new Project();
        project.setProjectName("Proje X");

        User user = new User();
        user.setUserName("ismail");
        user.getProjects().add(project);

        Task task = new Task();
        task.setTaskName("Görev 1");
        task.setProject(project);

        CreateCommentRequest request = new CreateCommentRequest(
                "Bu görev üzerinde çalışmaya başladım.",
                user.getPublicId()
        );

        when(taskRepository.findByPublicId(task.getPublicId())).thenReturn(Optional.of(task));
        when(userRepository.findByPublicId(user.getPublicId())).thenReturn(Optional.of(user));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        CommentResponse response = commentService.addComment(task.getPublicId(), request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.commentDetail()).isEqualTo("Bu görev üzerinde çalışmaya başladım.");
        assertThat(response.commentedUserPublicId()).isEqualTo(user.getPublicId());
        assertThat(response.taskPublicId()).isEqualTo(task.getPublicId());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    @DisplayName("Kullanıcı projede yer almıyorsa yorum yaparken IllegalArgumentException fırlatılmalı")
    void addComment_WhenUserIsNotProjectMember_ShouldThrowIllegalArgumentException() {
        // Given
        Project project = new Project();
        project.setProjectName("Proje X");

        User user = new User();
        user.setUserName("yabanci_kullanici");
        // Projeye dahil değil

        Task task = new Task();
        task.setTaskName("Görev 1");
        task.setProject(project);

        CreateCommentRequest request = new CreateCommentRequest(
                "Yorum denemesi",
                user.getPublicId()
        );

        when(taskRepository.findByPublicId(task.getPublicId())).thenReturn(Optional.of(task));
        when(userRepository.findByPublicId(user.getPublicId())).thenReturn(Optional.of(user));

        // When & Then
        assertThatThrownBy(() -> commentService.addComment(task.getPublicId(), request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Kullanıcı bu projede yok");

        verify(commentRepository, never()).save(any(Comment.class));
    }
}
