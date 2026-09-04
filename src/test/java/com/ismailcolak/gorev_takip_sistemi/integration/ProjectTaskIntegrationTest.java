package com.ismailcolak.gorev_takip_sistemi.integration;

import tools.jackson.databind.ObjectMapper;
import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateProjectRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateTaskRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.request.CreateUserRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.request.UpdateTaskStatusRequest;
import com.ismailcolak.gorev_takip_sistemi.dto.response.ProjectResponse;
import com.ismailcolak.gorev_takip_sistemi.dto.response.TaskResponse;
import com.ismailcolak.gorev_takip_sistemi.dto.response.UserResponse;
import com.ismailcolak.gorev_takip_sistemi.entities.TaskPriority;
import com.ismailcolak.gorev_takip_sistemi.entities.TaskStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectTaskIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Uçtan uca senaryo: Proje -> Kullanıcı -> Projeye Ekleme -> Görev Açma -> Durum Güncelleme")
    void fullFlow_ProjectUserTaskLifecycle() throws Exception {
        // 1. Proje Oluştur
        CreateProjectRequest projectReq = new CreateProjectRequest("TÜBİTAK BİLGEM Takip");
        MvcResult projectResult = mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.projectName").value("TÜBİTAK BİLGEM Takip"))
                .andReturn();

        ProjectResponse project = objectMapper.readValue(
                projectResult.getResponse().getContentAsString(),
                ProjectResponse.class
        );

        // 2. Kullanıcı Oluştur
        CreateUserRequest userReq = new CreateUserRequest("ismail_dev");
        MvcResult userResult = mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userName").value("ismail_dev"))
                .andReturn();

        UserResponse user = objectMapper.readValue(
                userResult.getResponse().getContentAsString(),
                UserResponse.class
        );

        // 3. Kullanıcıyı Projeye Ekle
        mockMvc.perform(post("/api/users/" + user.publicId() + "/projects/" + project.publicId()))
                .andExpect(status().isOk());

        // 4. Projede Görev Oluştur (Atanan kişi: ismail_dev)
        CreateTaskRequest taskReq = new CreateTaskRequest(
                "JPA İlişkileri Kurulumu",
                "Entities ve Repositories tamamlanacak",
                TaskPriority.HIGH,
                project.publicId(),
                user.publicId()
        );

        MvcResult taskResult = mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.taskName").value("JPA İlişkileri Kurulumu"))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.assignedUserPublicId").value(user.publicId()))
                .andReturn();

        TaskResponse task = objectMapper.readValue(
                taskResult.getResponse().getContentAsString(),
                TaskResponse.class
        );

        // 5. Görev Durumunu Güncelle (IN_PROGRESS)
        UpdateTaskStatusRequest updateReq = new UpdateTaskStatusRequest(TaskStatus.IN_PROGRESS);
        mockMvc.perform(patch("/api/tasks/" + task.publicId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));

        // 6. Görevi ID ile sorgula
        mockMvc.perform(get("/api/tasks/" + task.publicId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.taskName").value("JPA İlişkileri Kurulumu"))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }
}
