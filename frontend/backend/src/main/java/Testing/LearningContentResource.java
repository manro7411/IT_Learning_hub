package Testing;

import QuizService.Entity.QuestionChoiceEntity;
import QuizService.Entity.QuestionEntity;
import QuizService.QuestionType;
import QuizService.ExtendedLearningContentDto;
import QuizService.QuestionDTO;
import QuizService.ChoiceDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import dto.LearningContentDto;
import io.netty.handler.codec.http.multipart.FileUpload;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Request;
import jakarta.ws.rs.core.Response;
import model.LearningContent;
import model.UserLessonProgress;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Path("/learning")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class LearningContentResource {

    @Inject EntityManager em;
    @Inject JsonWebToken jwt;

    private static final int DEFAULT_BUFFER_SIZE = 4096;

    @GET
    @RolesAllowed({"user","admin"})
    public List<LearningContentDto> list(@QueryParam("mine") @DefaultValue("false") boolean mine) {
        if (mine) {
            String email = jwt.getSubject();
            return em.createQuery("""
                    SELECT lc FROM LearningContent lc
                    WHERE lc.authorEmail = :email
                    ORDER BY lc.createdAt DESC
                    """, LearningContent.class)
                    .setParameter("email", email)
                    .getResultStream()
                    .map(LearningContentDto::fromEntity)
                    .toList();
        }
        return em.createQuery("""
                SELECT lc FROM LearningContent lc
                ORDER BY lc.createdAt DESC
                """, LearningContent.class)
                .getResultStream()
                .map(LearningContentDto::fromEntity)
                .toList();
    }

    @GET
    @Path("/video/{filename}")
    @Produces("video/mp4")
    public Response getVideo(@PathParam("filename") String filename) {

        try {
            java.nio.file.Path videoPath = java.nio.file.Paths.get("uploads/video", filename);
            if (!Files.exists(videoPath)) {
                throw new NotFoundException("Video not found.");
            }

            return Response.ok(Files.newInputStream(videoPath))
                    .header("Accept-Ranges", "bytes")
                    .header("Content-Disposition", "inline; filename=\"" + filename + "\"")
                    .build();
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to load video.");
        }
    }
    @GET
    @Path("/video/v2/{filename}")
    @Produces("video/mp4")
    public Response getVideoV2(@PathParam("filename") String filename, @HeaderParam("Range") String rangeHeader) {
        try {
            java.nio.file.Path videoPath = java.nio.file.Paths.get("uploads/video", filename);
            if (!Files.exists(videoPath)) {
                throw new NotFoundException("Video not found.");
            }

            long fileLength = Files.size(videoPath);
            InputStream inputStream;
            long start = 0;
            long end = fileLength - 1;

            if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                String[] ranges = rangeHeader.substring(6).split("-");
                start = Long.parseLong(ranges[0]);
                if (ranges.length > 1 && !ranges[1].isEmpty()) {
                    end = Long.parseLong(ranges[1]);
                }

                if (end >= fileLength) {
                    end = fileLength - 1;
                }

                long contentLength = end - start + 1;
                inputStream = Files.newInputStream(videoPath);
                inputStream.skip(start);

                return Response.status(Response.Status.PARTIAL_CONTENT)
                        .entity(inputStream)
                        .header("Content-Type", "video/mp4")
                        .header("Accept-Ranges", "bytes")
                        .header("Content-Range", "bytes " + start + "-" + end + "/" + fileLength)
                        .header("Content-Length", contentLength)
                        .header("Content-Disposition", "inline; filename=\"" + filename + "\"")
                        .build();
            } else {
                inputStream = Files.newInputStream(videoPath);
                return Response.ok(inputStream)
                        .header("Content-Length", fileLength)
                        .header("Accept-Ranges", "bytes")
                        .header("Content-Disposition", "inline; filename=\"" + filename + "\"")
                        .build();
            }
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to load video.");
        }
    }


    @POST
    @Transactional
    @RolesAllowed("admin")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(ExtendedLearningContentDto dto) {
        if (dto.questionsJson != null && !dto.questionsJson.isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                dto.questions = mapper.readValue(dto.questionsJson,
                        new com.fasterxml.jackson.core.type.TypeReference<List<QuestionDTO>>() {});
                System.out.println("✅ Parsed questions count: " + dto.questions.size());
            } catch (Exception e) {
                System.out.println("❌ Failed to parse questions JSON");
                e.printStackTrace();
                throw new BadRequestException("Invalid format for questions JSON");
            }
        }

        String lessonId = UUID.randomUUID().toString().replace("-", "").substring(0, 21);
        LearningContent lc = new LearningContent();
        lc.setId(lessonId);
        lc.setTitle(dto.title);
        lc.setDescription(dto.description);
        lc.setCategory(dto.category);
        lc.setThumbnailUrl(dto.thumbnailUrl);
        lc.setAuthorName(jwt.getClaim("name"));
        lc.setAuthorEmail(jwt.getSubject());
        lc.setAuthorRole("admin");
        lc.setClickCount(0L);
        lc.setAuthorAvatarUrl(dto.authorAvatarUrl);
        lc.setCreatedAt(LocalDateTime.now());
        lc.setMaxAttempts(Optional.ofNullable(dto.maxAttempts).orElse(1));
        lc.setContentType(dto.contentType);
        lc.setAssignType(dto.assignType);
        lc.setAssignedUserIds(dto.assignedUserIds);
        lc.setAssignedTeamIds(dto.assignedTeamIds);
        lc.setDueDate(dto.dueDate);

        if (dto.videoStream != null) {
            try {
                String originalName = dto.videoMeta != null ? dto.videoMeta.fileName() : "video.mp4";
                String filename = lessonId + ".mp4";
                java.nio.file.Path dir = java.nio.file.Paths.get("uploads/video");
                java.nio.file.Files.createDirectories(dir);
                java.nio.file.Path videoPath = dir.resolve(filename);
                java.nio.file.Files.copy(dto.videoStream, videoPath, StandardCopyOption.REPLACE_EXISTING);

                System.out.println("Video path : " + videoPath.toString());
                System.out.println("Original file name: " + originalName);
                lc.setVideoUrl("uploads/video/" + filename);
            } catch (Exception e) {
                throw new InternalServerErrorException("Failed to save video.");
            }
        }

        em.persist(lc);

        String quizId = UUID.randomUUID().toString().replace("-", "").substring(0, 21);
        if (dto.questions != null) {
            for (QuestionDTO q : dto.questions) {
                QuestionEntity qe = new QuestionEntity();
                qe.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 21));
                qe.setLearningContent(lc);
                qe.setQuiz_id(quizId);
                qe.setQuestionText(q.questionText);
                qe.setType(QuestionType.valueOf(q.type.toUpperCase()));
                qe.setPoints(q.points != null ? q.points : 1);
                em.persist(qe);

                if (q.choices != null) {
                    for (ChoiceDTO c : q.choices) {
                        QuestionChoiceEntity ce = new QuestionChoiceEntity();
                        ce.id = UUID.randomUUID().toString().replace("-", "").substring(0, 21);
                        ce.question = qe;
                        ce.choiceText = c.text;
                        ce.isCorrect = c.isCorrect;
                        em.persist(ce);
                    }
                }
            }
        }

        System.out.println("📥 Received new lesson creation request:");
        System.out.println("Title: " + dto.title);
        System.out.println("Description: " + dto.description);
        System.out.println("Category: " + dto.category);
        System.out.println("Thumbnail URL: " + dto.thumbnailUrl);
        System.out.println("Assign Type: " + dto.assignType);
        System.out.println("Assigned Users: " + (dto.assignedUserIds != null ? dto.assignedUserIds : "[]"));
        System.out.println("Assigned Teams: " + (dto.assignedTeamIds != null ? dto.assignedTeamIds : "[]"));
        System.out.println("Due Date: " + dto.dueDate);
        System.out.println("Author Avatar URL: " + dto.authorAvatarUrl);
        System.out.println("Max Attempts: " + dto.maxAttempts);
        System.out.println("Video Meta: " + (dto.videoMeta != null ? dto.videoMeta.fileName() : "No file meta"));
        System.out.println("Questions count: " + (dto.questions != null ? dto.questions.size() : 0));

        return Response.created(URI.create("/learning/" + lc.getId()))
                .entity(LearningContentDto.fromEntity(lc))
                .build();
    }


    @PUT
    @Path("/{id}")
    @Transactional
    @RolesAllowed("admin")
    public LearningContentDto update(@PathParam("id") String id, LearningContentDto dto) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc == null) throw new NotFoundException();

        lc.setTitle(dto.title());
        lc.setDescription(dto.description());
        lc.setCategory(dto.category());
        lc.setThumbnailUrl(dto.thumbnailUrl());
        lc.setAssignType(dto.assignType());
        lc.setAssignedUserIds(dto.assignedUserIds());
        lc.setAssignedTeamIds(dto.assignedTeamIds());
        lc.setAuthorAvatarUrl(dto.authorAvatarUrl());

        if (dto.dueDate() != null) {
            lc.setDueDate(dto.dueDate());
        }

        return LearningContentDto.fromEntity(lc);
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @RolesAllowed("admin")
    public void delete(@PathParam("id") String id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc != null) em.remove(lc);
    }

    @GET
    @Path("/{id}")
    public LearningContentDto getOne(@PathParam("id") String id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc == null) throw new NotFoundException();
        return LearningContentDto.fromEntity(lc);
    }

    @POST
    @Path("/{id}/click")
    @Transactional
    @RolesAllowed("user")
    public void addClick(@PathParam("id") String lessonId) {
        String userEmail = jwt.getSubject();
        UserLessonProgress progress = em.createQuery(
                        "SELECT p FROM UserLessonProgress p WHERE p.lessonId = :lessonId AND p.userEmail = :userEmail",
                        UserLessonProgress.class)
                .setParameter("lessonId", lessonId)
                .setParameter("userEmail", userEmail)
                .getResultStream()
                .findFirst()
                .orElse(null);

        if (progress == null) {
            progress = new UserLessonProgress();
            progress.setLessonId(lessonId);
            progress.setUserEmail(userEmail);
            progress.setPercent(1);
            progress.setUpdatedAt(LocalDateTime.now());
            em.persist(progress);
        } else {
            progress.setPercent(Math.max(progress.getPercent(), 1));
            progress.setUpdatedAt(LocalDateTime.now());
        }

        int updated = em.createQuery("UPDATE LearningContent lc SET lc.clickCount = lc.clickCount + 1 WHERE lc.id = :id")
                .setParameter("id", lessonId)
                .executeUpdate();
        if (updated == 0) throw new NotFoundException();
    }

    @GET
    @Path("/{id}/click-count")
    public Long getClickCount(@PathParam("id") String id) {
        LearningContent lc = em.find(LearningContent.class, id);
        if (lc == null) throw new NotFoundException();
        return lc.getClickCount();
    }

    @GET
    @Path("/top-viewed")
    public List<LearningContentDto> topViewed(@QueryParam("limit") @DefaultValue("5") int limit) {
        return em.createQuery("""
                SELECT lc FROM LearningContent lc
                ORDER BY lc.clickCount DESC
                """, LearningContent.class)
                .setMaxResults(limit)
                .getResultStream()
                .map(LearningContentDto::fromEntity)
                .toList();
    }

    @GET
    @Path("/assigned-to-me")
    @RolesAllowed({"user", "admin"})
    public List<LearningContentDto> getAssignedToMe() {
        String userEmail = jwt.getSubject();

        List<String> myTeamIds = em.createQuery("""
            SELECT DISTINCT m.team.id FROM MemberEntity m
            WHERE m.userID = :userId
        """, String.class)
                .setParameter("userId", userEmail)
                .getResultList();

        List<LearningContent> lessons = em.createQuery("""
    SELECT lc FROM LearningContent lc
    WHERE
        lc.assignType = 'all'
        OR (lc.assignType = 'specific' AND :userId IN ELEMENTS(lc.assignedUserIds))
        OR (lc.assignType = 'team' AND EXISTS (
            SELECT 1 FROM LearningContent l2
            WHERE l2.id = lc.id AND EXISTS (
                SELECT teamId FROM LearningContent l3 JOIN l3.assignedTeamIds teamId
                WHERE teamId IN :teamIds
            )
        ))
    ORDER BY lc.createdAt DESC
""", LearningContent.class)
                .setParameter("userId", userEmail)
                .setParameter("teamIds", myTeamIds)
                .getResultList();

        return lessons.stream()
                .map(LearningContentDto::fromEntity)
                .toList();
    }
    @GET
    @Path("/upcoming-due")
    @RolesAllowed({"user", "admin"})
    public List<LearningContentDto> getUpcomingDue() {
        List<LearningContent> lessons = em.createQuery("""
        SELECT lc FROM LearningContent lc
        WHERE lc.dueDate IS NOT NULL
        ORDER BY lc.dueDate ASC
    """, LearningContent.class)
                .setMaxResults(20)
                .getResultList();

        return lessons.stream()
                .map(LearningContentDto::fromEntity)
                .toList();
    }

    @GET
    @Path("/document/{filename}")
    @Produces({"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"})
    public Response getDocument(@PathParam("filename") String filename) {
        validateFilename(filename);
        try {
            java.nio.file.Path file = Paths.get("uploads/documents", filename);
            if (!Files.exists(file)) {
                throw new NotFoundException("File not found: " + filename);
            }

            String mimeType = Files.probeContentType(file); // Automatically detect MIME type
            System.out.println(mimeType);
            if (mimeType == null) {
                mimeType = "application/octet-stream";
            }

            return Response.ok(Files.newInputStream(file))
                    .type(mimeType)
                    .header("Content-Disposition", "inline; filename=\"" + filename + "\"")
                    .build();

        } catch (IOException e) {
            throw new InternalServerErrorException("Failed to load document: " + filename, e);
        }
    }


    @POST
    @Path("/documents")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed("admin")
    @Transactional
    public Response uploadDocument(PdfUploadForm form) {

        try {
            if (form.document == null || form.document.uploadedFile() == null) {
                throw new BadRequestException("Missing document file.");
            }
            LearningContent lc = new LearningContent();
            String lessonId = UUID.randomUUID().toString().replace("-", "").substring(0, 21);
            String originalName = form.document.fileName();
            String extension = originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : "";
            String newFileName = UUID.randomUUID().toString().replace("-", "") + extension;

            java.nio.file.Path dir = java.nio.file.Paths.get("uploads/documents");
            java.nio.file.Files.createDirectories(dir);
            java.nio.file.Path destination = dir.resolve(newFileName);

            Files.copy(form.document.uploadedFile(), destination, StandardCopyOption.REPLACE_EXISTING);
            lc.setId(lessonId);
            lc.setTitle(form.title);
            lc.setDescription(form.description);
            lc.setCreatedAt(LocalDateTime.now());
            lc.setAuthorName(jwt.getClaim("name"));
            lc.setAuthorEmail(jwt.getSubject());
            lc.setAuthorRole("admin");
            lc.setContentType("document");
            lc.setAuthorAvatarUrl(form.avatarUrl);
            lc.setCategory(form.category);
            lc.setAssignType(form.assignType);
            lc.setDocumentUrl(destination.toString().replace("\\", "/"));

            em.persist(lc);
            return Response.ok().entity("{\"message\": \"✅ Document uploaded successfully.\"}").build();

        } catch (Exception e) {
            e.printStackTrace();
            throw new InternalServerErrorException("❌ Failed to save document.");
        }
    }

    private void validateFilename(String filename) {
        if (filename == null || filename.isEmpty()) {
            throw new BadRequestException("Filename is required.");
        }

        // Reject filenames with illegal characters
        if (!filename.matches("^[\\w,\\s-]+\\.[A-Za-z]{3,4}$")) {
            throw new BadRequestException("Invalid filename: " + filename);
        }
    }


}
