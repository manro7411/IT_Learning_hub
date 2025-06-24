package Forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO สำหรับรับข้อมูลจาก REST API เวลาผู้ใช้สร้างโพสต์ใหม่
 * ไม่ต้องมี author เพราะ backend จะดึงจาก SecurityIdentity
 */
public class PostCreateRequest {

    @NotBlank(message = "Title must not be blank")
    @Size(max = 255, message = "Title must be at most 255 characters")
    public String title;

    @NotBlank(message = "Message must not be blank")
    public String message;

    // ✅ ไม่ต้องมี field author — backend จะจัดการให้
}
