package dto;

import model.LearningContent;

public record LearningContentDto(
        String id,
        String title,
        String description,
        String category,
        String thumbnailUrl,
        String authorName,
        String authorEmail,
        String authorAvatarUrl,
        Integer progressPercent,
        Long clickCount
) {
    public static LearningContentDto fromEntity(LearningContent e) {
        return new LearningContentDto(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getCategory(),
                e.getThumbnailUrl(),
                e.getAuthorName(),
                e.getAuthorEmail(),
                e.getAuthorAvatarUrl(),
                e.getProgressPercent(),
                e.getClickCount()
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
        e.setProgressPercent(progressPercent);
        e.setClickCount(clickCount != null ? clickCount : 0L);
        return e;
    }
}