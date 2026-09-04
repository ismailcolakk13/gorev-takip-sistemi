package com.ismailcolak.gorev_takip_sistemi.repositories;

import com.ismailcolak.gorev_takip_sistemi.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByPublicId(String publicId);
    boolean existsByProjectName(String projectName);
}
