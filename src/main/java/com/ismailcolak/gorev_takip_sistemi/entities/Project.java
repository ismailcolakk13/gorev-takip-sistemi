package com.ismailcolak.gorev_takip_sistemi.entities;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "public_id", unique = true, nullable = false, updatable = false)
    private String publicId = UUID.randomUUID().toString();

    @Column(name = "project_name",nullable = false)
    private String projectName;



    public Project() {}

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getPublicId() {
        return publicId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
