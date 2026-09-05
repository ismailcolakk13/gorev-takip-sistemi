package com.ismailcolak.gorev_takip_sistemi.repositories;

import com.ismailcolak.gorev_takip_sistemi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByPublicId(String publicId);
    Optional<User> findByUserName(String userName);
    List<User> findByProjects_ProjectId(Long projectId);
    List<User> findByProjects_PublicId(String publicId);
}
