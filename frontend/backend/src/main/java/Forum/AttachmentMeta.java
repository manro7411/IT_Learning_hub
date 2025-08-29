package Forum;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class AttachmentMeta {
    @Column(name = "file_name", nullable = false, length = 255)
    private String filename;

    @Column(name = "original_name", length = 255)
    private String originalName;

    @Column(name = "mime_type", length = 127)
    private String mimeType;         // Content-Type

    @Column(name = "file_size")
    private long size;               // ขนาด (ไบต์)

    public AttachmentMeta() {}

    public AttachmentMeta(String filename, String originalName, String mimeType, long size) {
        this.filename = filename;
        this.originalName = originalName;
        this.mimeType = mimeType;
        this.size = size;
    }

    public String getFilename() {
        return filename;
    }
    public String getOriginalName() {
        return originalName;
    }
    public String getMimeType() {
        return mimeType;
    }
    public long getSize() {
        return size;
    }
    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }
    public void setFilename(String filename) {
        this.filename = filename;
    }
    public void setSize(long size) {
        this.size = size;
    }
}
