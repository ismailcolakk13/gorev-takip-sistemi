# Task Tracker (Mini-JIRA) — Proje Handoff

**Amaç:** TÜBİTAK BİLGEM "Yazılım Mühendisi" ilanındaki JEE yığınına (JPA/Hibernate, Servlet,
Maven) dokunan, CV'ye eklenecek bir Spring Boot projesi. 26 günlük yol haritasının parçası.

---

## Tech Stack

- **Backend:** Java, Spring Boot (Spring Web, Spring Data JPA, Validation)
- **Veritabanı:** MySQL 8 (Docker ile lokal)
- **Build:** Maven
- **Test:** JUnit + Mockito, Postman koleksiyonu
- **Kod kalitesi:** SonarQube (lokal, Docker)
- **Deploy hedefi:** Linux ortamında Tomcat / embedded server

---

## Veritabanı Şeması (final, onaylanmış)

**Project**
- `project_id: num` (PK)
- `project_name: str`
- *(koleksiyon yok — inverse taraf)*

**User**
- `user_id: num` (PK)
- `user_name: str`
- `projects: List<Project>` — **Many-to-Many owning side** (`@ManyToMany` + `@JoinTable`)

**Task**
- `task_id: num` (PK)
- `task_name: str`
- `task_detail: str`
- `project: Project` — **Many-to-One** (owning, FK: `project_id`)
- `assigned_user: User` — **Many-to-One** (owning, FK: `assigned_user_id`)
- `status: enum` → `TODO`, `IN_PROGRESS`, `DONE`
- `priority: enum` → `LOW`, `MEDIUM`, `HIGH`

**Comment**
- `comment_id: num` (PK)
- `comment_detail: str`
- `user_commented: User` — **Many-to-One** (owning, FK: `user_id`)
- `task: Task` — **Many-to-One** (owning, FK: `task_id`)

### İlişki özeti
| İlişki | Tip | Owning taraf |
|---|---|---|
| Project ↔ User | Many-to-Many | User (`@JoinTable`) |
| Project → Task | One-to-Many / Many-to-One | Task |
| User → Task (assigned_user) | One-to-Many / Many-to-One | Task |
| User → Comment (user_commented) | One-to-Many / Many-to-One | Comment |
| Task → Comment | One-to-Many / Many-to-One | Comment |

**Tasarım kararı:** Project, Task, Comment tarafında ters (inverse) koleksiyon alanları
(`tasks: List<Task>`, `comments: List<Comment>` vb.) bilinçli olarak **eklenmedi** — N+1 sorgu
riskini ve JSON serialize sırasında sonsuz döngü riskini önlemek için. İlgili task/comment
listeleri gerektiğinde repository sorgusuyla (`findByProjectId`, `findByTaskId` vb.) alınacak.

---

## Kodlama Sırası (bağımlılık sırasına göre)

1. Enum'lar: `TaskStatus`, `TaskPriority`
2. `Project`, `User` entity'leri
3. `User.projects` M2M mapping (`@ManyToMany` + `@JoinTable`)
4. `Task` entity'si (Project ve User'a bağımlı)
5. `Comment` entity'si (User ve Task'a bağımlı, en son)
6. Repository katmanı (Spring Data JPA, `JpaRepository`)
7. Servis katmanı — iş kuralları burada (örn. "sadece proje üyesine görev atanabilir")
8. Controller + Request/Response DTO'lar (entity'leri doğrudan API'de dönme)
9. `@ControllerAdvice` ile merkezi exception handler
10. Servlet Filter (request logging veya basit auth) — `FilterRegistrationBean` ile kayıt
11. Testler (JUnit/Mockito + en az bir `@SpringBootTest`)
12. Maven build doğrulama, SonarQube taraması
13. Docker/Linux deploy, README, CV'ye ekleme

---

## MySQL — Docker Compose

`docker-compose.yml` (proje kök dizini, `pom.xml` ile aynı seviye):

```yaml
services:
  mysql:
    image: mysql:8
    container_name: taskdb-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: taskdb
      MYSQL_USER: taskuser
      MYSQL_PASSWORD: taskpass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Başlatma: `docker compose up -d`
Kontrol: `docker compose ps`, `docker compose logs -f mysql`
Sıfırlama: `docker compose down -v`

---

## application.yml

`src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/taskdb
    username: taskuser
    password: taskpass
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

**Not:** MySQL ile `@GeneratedValue(strategy = GenerationType.IDENTITY)` kullan
(Postgres'teki `SEQUENCE` stratejisinden farklı).

---

## İlandaki Maddelerle Eşleşme (CV'ye eklerken kullan)

- **Java + Spring** → tüm proje
- **Temel düzeyde SQL** → MySQL şema tasarımı, ilişkisel sorgular
- **Web tabanlı yazılım geliştirme / REST API** → Controller katmanı
- **JEE teknolojileri (JPA, Servlet)** → Spring Data JPA + Hibernate, elle yazılmış Servlet Filter
- **Continuous Integration (Maven)** → `mvn clean install`
- **Source Code Analiz araçları** → SonarQube taraması
- **Linux işletim sistemleri / uygulama sunucuları** → Docker + Tomcat deploy
- **Nesne Yönelimli Tasarım** → entity/servis/DTO katman ayrımı

---

## Açık Notlar / Kararlar

- Diyagram birkaç iterasyondan geçti, yukarıdaki şema **final** halidir.
- `assigned_user` alan adına dikkat (bir ara `assgined_user` yazım hatası vardı, düzeltildi).
- Many-to-Many'de owning side olarak **User** seçildi (Project'te ilgili koleksiyon yok).
- Kod İsmail tarafından yazılacak — bu doküman sadece karar/kapsam takibi içindir.