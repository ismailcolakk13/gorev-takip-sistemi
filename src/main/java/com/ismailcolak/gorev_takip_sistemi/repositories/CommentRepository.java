package com.ismailcolak.gorev_takip_sistemi.repositories;

import com.ismailcolak.gorev_takip_sistemi.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<Comment> findByPublicId(String publicId);

    List<Comment> findByTask_TaskId(Long taskId);

    List<Comment> findByTask_PublicId(String publicId);

    List<Comment> findByCommentedUser_UserId(Long userId);
}
