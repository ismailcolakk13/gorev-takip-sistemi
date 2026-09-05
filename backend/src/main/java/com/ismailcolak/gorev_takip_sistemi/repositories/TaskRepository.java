package com.ismailcolak.gorev_takip_sistemi.repositories;

import com.ismailcolak.gorev_takip_sistemi.entities.Task;
import com.ismailcolak.gorev_takip_sistemi.entities.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findByPublicId(String publicId);

    List<Task> findByProject_ProjectId(Long projectId);
    List<Task> findByAssignedUser_UserId(Long userId);

    List<Task> findByProject_PublicId(String publicId);
    List<Task> findByAssignedUser_PublicId(String publicId);

    List<Task> findByTaskStatus(TaskStatus status);
}
