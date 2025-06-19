package dto;
import model.LearningContent;

/* ใช้ record ต้องเป็น Java 16+ */
public record LearningContentDto(
        Long id,
        String title,
        String description,
        String category,
        String thumbnailUrl,
        String authorName,
        int    progressPercent
) {
    public static LearningContentDto fromEntity(LearningContent e) {
        return new LearningContentDto(
                e.getId(), e.getTitle(), e.getDescription(),
                e.getCategory(), e.getThumbnailUrl(),
                e.getAuthorName(), e.getProgressPercent());
    }
    public LearningContent toEntity() {
        LearningContent e = new LearningContent();
        e.setTitle(title);
        e.setDescription(description);
        e.setCategory(category);
        e.setThumbnailUrl(thumbnailUrl);
        return e;
    }
}
