package dto;

import model.LearningContent;

import java.time.LocalDateTime;
import java.util.List;

public record LearningContentDto(
        String id,
        String title,
        String description,
        String category,
        String thumbnailUrl,
        String authorName,
        String contentType,
        String authorEmail,
        String videoUrl,
        String authorAvatarUrl,
        Integer progressPercent,
        String assignType,
        List<String> assignedUserIds,
        List<String> assignedTeamIds,
        LocalDateTime dueDate
) {

    public static LearningContentDto fromEntity(LearningContent e) {
        return new LearningContentDto(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getCategory(),
                e.getThumbnailUrl(),
                e.getAuthorName(),
                e.getContentType(),
                e.getAuthorEmail(),
                e.getVideoUrl(),
                e.getAuthorAvatarUrl(),
                e.getProgressPercent() != null ? e.getProgressPercent() : 0,
                e.getAssignType(),
                e.getAssignedUserIds(),
                e.getAssignedTeamIds(),
                e.getDueDate()

        );
    }

    public LearningContent toEntity() {
        LearningContent e = new LearningContent();
        e.setId(id);
        e.setTitle(title);
        e.setDescription(description);
        e.setCategory(category);
        e.setThumbnailUrl(thumbnailUrl);
        e.setAuthorName(authorName);
        e.setAuthorEmail(authorEmail);
        e.setAuthorAvatarUrl(authorAvatarUrl);
        e.setProgressPercent(progressPercent != null ? progressPercent : 0);
        e.setAssignType(assignType);
        e.setAssignedUserIds(assignedUserIds);
        e.setAssignedTeamIds(assignedTeamIds);
        e.setDueDate(dueDate);
        e.setVideoUrl(videoUrl);
        e.setContentType(contentType);
        return e;
    }
}
