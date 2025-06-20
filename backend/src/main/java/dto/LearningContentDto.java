package dto;

import model.LearningContent;

/**
 * Lightweight DTO สำหรับส่ง/รับข้อมูล LearningContent ไป-กลับ REST API
 *  – รองรับ authorEmail และ authorAvatarUrl
 *  – id เป็น String (เนื่องจากเราใช้ NanoId สร้างด้วยมือ ไม่ใช่ IDENTITY)
 */
public record LearningContentDto(
        /* ────────── fields ที่ต้องการให้ FE เห็น ────────── */
        String  id,
        String  title,
        String  description,
        String  category,
        String  thumbnailUrl,

        /* ข้อมูลผู้สร้างคอร์ส */
        String  authorName,
        String  authorEmail,
        String  authorAvatarUrl,

        /* ความคืบหน้ารวม (optional) */
        Integer progressPercent
) {

    /* ---------- Entity ➜ DTO ---------- */
    public static LearningContentDto fromEntity(LearningContent e) {
        return new LearningContentDto(
                e.getId(),                // String (NanoId)
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

    /* ---------- DTO ➜ Entity (ใช้ตอน POST/PUT) ---------- */
    public LearningContent toEntity() {
        LearningContent e = new LearningContent();
        // ❌ **อย่าเซ็ต id** ที่นี่ ปล่อยให้ Resource/Service เซ็ตผ่าน NanoId
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
