package dto;
import model.LearningContent;
public record LearningContentDto(
        Long     id,
        String   title,
        String   description,
        String   category,
        String   thumbnailUrl,
        String   authorName,
        String   authorAvatarUrl,   // ✅ NEW
        Integer  progressPercent
) {

    /* ─── Mapping : Entity → DTO ─── */
    public static LearningContentDto fromEntity(LearningContent e) {
        return new LearningContentDto(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getCategory(),
                e.getThumbnailUrl(),
                e.getAuthorName(),
                e.getAuthorAvatarUrl(),   // ✅ NEW
                e.getProgressPercent()
        );
    }

    /* ─── Mapping : DTO → Entity  (ใช้ตอน POST/PUT) ─── */
    public LearningContent toEntity() {
        LearningContent e = new LearningContent();
        e.setTitle(title);
        e.setDescription(description);
        e.setCategory(category);
        e.setThumbnailUrl(thumbnailUrl);
        e.setAuthorName(authorName);                 // optional: อนุญาตให้ admin ใส่หรือดึงจาก JWT ภายหลัง
        e.setAuthorAvatarUrl(authorAvatarUrl);       // ✅ NEW
        e.setProgressPercent(
                progressPercent != null ? progressPercent : 0
        );
        return e;
    }
}
