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
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository, TaskRepository taskRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    public CommentResponse addComment(String taskPublicId, CreateCommentRequest request) {
        Task task = taskRepository.findByPublicId(taskPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Yorum ekleme başarısız\nGörev bulunamadı: " + taskPublicId));

        User user = userRepository.findByPublicId(request.userPublicId())
                .orElseThrow(() -> new IllegalArgumentException("Yorum ekleme başarısız\nKullanıcı bulunamadı: " + request.userPublicId()));

        if (!isMemberOfProject(user, task.getProject())) {
            throw new IllegalArgumentException("Yorum ekleme başarısız\nKullanıcı bu projede yok:" + request.userPublicId());
        }

        Comment comment = new Comment();
        comment.setTask(task);
        comment.setCommentedUser(user);
        comment.setCommentDetail(request.commentDetail());

        commentRepository.save(comment);

        return mapToResponse(comment);
    }

    public List<CommentResponse> getCommentsByTask(String taskPublicId) {
        List<Comment> comments = commentRepository.findByTask_PublicId(taskPublicId);

        return comments.stream()
                .map(c -> mapToResponse(c)).toList();
    }

    public List<CommentResponse> getCommentsByUser(String userPublicId) {
        List<Comment> comments = commentRepository.findByCommentedUser_PublicId(userPublicId);

        return comments.stream()
                .map(c -> mapToResponse(c)).toList();
    }


    private CommentResponse mapToResponse(Comment comment) {
        return new CommentResponse(
                comment.getPublicId(),
                comment.getCommentDetail(),
                comment.getCommentedUser().getPublicId(),
                comment.getTask().getPublicId()
        );
    }

    private boolean isMemberOfProject(User user, Project project) {
        boolean isMember = user.getProjects().stream()
                .anyMatch(p -> p.getPublicId().equals(project.getPublicId()));

        return isMember;
    }
}
