package com.ismailcolak.gorev_takip_sistemi.services;

import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateUserRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.UserResponse;
import com.ismailcolak.gorev_takip_sistemi.entities.Project;
import com.ismailcolak.gorev_takip_sistemi.entities.User;
import com.ismailcolak.gorev_takip_sistemi.repositories.ProjectRepository;
import com.ismailcolak.gorev_takip_sistemi.repositories.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public UserService(UserRepository userRepository, ProjectRepository projectRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    public UserResponse createUser(CreateUserRequest createUserRequest) {
        User user = new User();
        user.setUserName(createUserRequest.userName());
        userRepository.save(user);

        return new UserResponse(user.getPublicId(), user.getUserName());
    }

    public UserResponse getUserByPublicId(String publicId) {
        User user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new EntityNotFoundException("Kullanıcı getirme başarısız\nKulanıcı bulunamadı: " + publicId));

        return new UserResponse(user.getPublicId(), user.getUserName());
    }

    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(u -> new UserResponse(u.getPublicId(), u.getUserName()))
                .toList();
    }


    public void addUserToProject(String userPublicId, String projectPublicId) {
        Project project = projectRepository.findByPublicId(projectPublicId)
                .orElseThrow(() -> new EntityNotFoundException("Kullanıcı Projeye Ekleme başarısız\nProje bulunamadı: " + projectPublicId));

        User user = userRepository.findByPublicId(userPublicId)
                .orElseThrow(() -> new EntityNotFoundException("Kullanıcı Projeye Ekleme başarısız\nKullanıcı bulunamadı: " + userPublicId));

        user.getProjects().add(project);
        userRepository.save(user);
    }

    public List<UserResponse> getUsersByProject(String projectPublicId) {
        List<User> users = userRepository.findByProjects_PublicId(projectPublicId);
        return users.stream()
                .map(u -> new UserResponse(u.getPublicId(), u.getUserName()))
                .toList();
    }
}
