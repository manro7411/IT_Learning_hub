package dto;
import model.LearningContent;
public record LearningContentDto(
        String  id,
        String  title,
        String  description,
        String  category,
        String  thumbnailUrl,
        String  authorName,
        String  authorEmail,
        String  authorAvatarUrl,
        Integer progressPercent
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
                e.getProgressPercent()
        );
    }
    public LearningContent toEntity() {
        LearningContent e = new LearningContent();
        e.setTitle(title);
        e.setDescription(description);
        e.setCategory(category);
        e.setThumbnailUrl(thumbnailUrl);
        e.setAuthorName(authorName);
        e.setAuthorEmail(authorEmail);
        e.setAuthorAvatarUrl(authorAvatarUrl);
        e.setProgressPercent(progressPercent != null ? progressPercent : 0);
        return e;
    }
}