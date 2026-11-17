package com.travelguardian.user.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {

    @NotBlank(message = "Current password is required")
    @JsonAlias({"currentPassword", "oldPassword"})
    private String oldPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "New password must be at least 6 characters")
    private String newPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        if (this.oldPassword == null || this.oldPassword.isEmpty()) {
            this.oldPassword = currentPassword;
        }
    }
}
